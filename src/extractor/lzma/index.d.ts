declare namespace LZMA {
    function decompress(byte_arr: ArrayBuffer, on_finish?, on_progress?);
}

export default LZMA;
