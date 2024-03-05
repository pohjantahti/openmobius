# Extractor

Extractor is used to get game resources out of the original game assets.
Right now, these include textures, music and fonts.

Underlying logic of the extractor has been derived from AssetStudio. All the
unnecessary version specific functionality has been ignored since only one
version (5.0.1p2) is relevant. Currently, a lot of the code is commented out
as there is no use case for most of it (not right now, at least). Appropriate
reader position jumps are done right below the commented parts.

Check `LICENSE` for links to relevant projects.
