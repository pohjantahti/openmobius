# Used to generate the "src/pages/replica/data/resources/containers.json"

from io import BytesIO
from os import listdir, path
import json
import lzma

# Full path to "/MOBIUS FINAL FANTASY/mobiusff_Data/mobius_data/Hash"
hash_folder = ""
# Output folder
output_path = "scripts"

# AssetBundles outside the "Hash" folder
resource_list = {
    "StaticResident_gui__pack_win": "StreamingAssets/mobius_data_win/Gui/System/StaticResident/StaticResident_gui__pack_win.unity3d",
    "Corporate_gui__pack_win": "StreamingAssets/mobius_data_win/Gui/System/Corporate/Corporate_gui__pack_win.unity3d"
}

# Resource types to be included in "containers.json"
tags = [
    "AutoClip_gui",
    "BillBoard_gui",
    "Card_gui",
    "Font_gui",
    "music",
    "Thum_gui",
    "RegionMap_gui",
    "Resident_gui"
]

# Used to keep track of possible duplicate containers
# With the current tags, there's not supposed to be duplicates
duplicates = []

class Reader:
    def __init__(self, file):
        self.file = file

    def read(self, count):
        return self.file.read(count)

    def read_int(self, count):
        return int.from_bytes(self.file.read(count), "big")

    def read_to_null(self):
        bytes = []
        while True:
            byte = self.file.read(1)
            if byte == b"\x00":
                break
            else:
                bytes.append(byte)
        return b"".join(bytes)

def get_container_name(file):
    reader = Reader(file)
    signature = reader.read_to_null()
    reader.read_int(4)
    reader.read_to_null()
    reader.read_to_null()
    reader.read(20)
    data_size = reader.read_int(4)
    reader.read(9)
    data = reader.read(data_size)
    if signature == b"UnityWeb":
        data = lzma.decompress(data)
    reader = Reader(BytesIO(data))
    reader.read(4)
    name = reader.read_to_null()
    return name.decode("utf-8")

def main():
    if len(hash_folder) == 0:
        print("ERROR: Specify the full path to '/MOBIUS FINAL FANTASY/mobiusff_Data/mobius_data/Hash' in 'hash_folder' variable")
        return

    counter = 0
    # Loop the Hash folder
    for index, hex_folder in enumerate(listdir(hash_folder)):
        print("\rProgression: " + str(index) + "/256", end="")
        # Loop the AssetBundles
        for asset_bundle in listdir(path.join(hash_folder, hex_folder)):
            with open(path.join(hash_folder, hex_folder, asset_bundle), "rb") as file:
                name = get_container_name(file)
                if name in resource_list: # Mark the duplicate
                    duplicates.append({
                        "current": [name, hex_folder, asset_bundle],
                        "new": [name, hex_folder, asset_bundle]
                    })
                else: # Check if container is wanted
                    for tag in tags:
                        if tag in name:
                            resource_list[name] = path.join("mobius_data/Hash", hex_folder, asset_bundle).replace("\\", "/")
                            counter += 1

    with open(path.join(output_path, "containers.json"), "w") as file:
        json.dump(resource_list, file)
        print("")

    if duplicates:
        with open(path.join(output_path, "duplicates.json"), "w") as file:
            json.dump(duplicates, file)
            print("Duplicate containers found, see duplicates.json")

    print("Done! Found", counter, "resources")

if __name__ == "__main__":
    main()
