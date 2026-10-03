"""Store local API credentials in macOS Keychain without shell arguments."""

import ctypes
import sys


SERVICE = b"prompt-tool.api-keys"


def _frameworks():
    security = ctypes.CDLL("/System/Library/Frameworks/Security.framework/Security")
    core = ctypes.CDLL("/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation")
    pointer = ctypes.c_void_p
    uint = ctypes.c_uint32
    security.SecKeychainFindGenericPassword.argtypes = [
        pointer, uint, ctypes.c_char_p, uint, ctypes.c_char_p,
        ctypes.POINTER(uint), ctypes.POINTER(pointer), ctypes.POINTER(pointer),
    ]
    security.SecKeychainAddGenericPassword.argtypes = [
        pointer, uint, ctypes.c_char_p, uint, ctypes.c_char_p,
        uint, pointer, ctypes.POINTER(pointer),
    ]
    security.SecKeychainItemModifyAttributesAndData.argtypes = [pointer, pointer, uint, pointer]
    security.SecKeychainItemFreeContent.argtypes = [pointer, pointer]
    for name in (
        "SecKeychainFindGenericPassword", "SecKeychainAddGenericPassword",
        "SecKeychainItemModifyAttributesAndData", "SecKeychainItemFreeContent",
    ):
        getattr(security, name).restype = ctypes.c_int32
    core.CFRelease.argtypes = [pointer]
    core.CFRelease.restype = None
    return security, core


def read_key(name: str) -> str:
    if sys.platform != "darwin":
        return ""
    security, _ = _frameworks()
    account = name.encode("utf-8")
    length = ctypes.c_uint32()
    data = ctypes.c_void_p()
    status = security.SecKeychainFindGenericPassword(
        None, len(SERVICE), SERVICE, len(account), account,
        ctypes.byref(length), ctypes.byref(data), None,
    )
    if status == -25300:  # errSecItemNotFound
        return ""
    if status:
        raise OSError(status, "无法读取 macOS 钥匙串")
    try:
        return ctypes.string_at(data, length.value).decode("utf-8")
    finally:
        security.SecKeychainItemFreeContent(None, data)


def save_key(name: str, value: str) -> None:
    if sys.platform != "darwin":
        raise OSError("当前系统不支持 macOS 钥匙串")
    security, core = _frameworks()
    account = name.encode("utf-8")
    secret = value.encode("utf-8")
    item = ctypes.c_void_p()
    status = security.SecKeychainFindGenericPassword(
        None, len(SERVICE), SERVICE, len(account), account, None, None, ctypes.byref(item),
    )
    if status == -25300:
        status = security.SecKeychainAddGenericPassword(
            None, len(SERVICE), SERVICE, len(account), account, len(secret), secret, None,
        )
    elif status == 0:
        try:
            status = security.SecKeychainItemModifyAttributesAndData(item, None, len(secret), secret)
        finally:
            core.CFRelease(item)
    if status:
        raise OSError(status, "无法保存到 macOS 钥匙串")
