# Extractor

Extractor is used to get game resources out of the original game assets.
Right now, these include textures, music and fonts.

Underlying logic of the extractor has been derived from AssetStudio. All the
unnecessary version specific functionality has been ignored since only one
version (5.0.1p2) is relevant. Currently, a lot of the code is commented out
as there is no use case for most of it (not right now, at least). Appropriate
reader position jumps are done right below the commented parts.

`decode-dxt` and `lzma` npm packages have been directly included in the project
in an effort to preserve them as they haven't received updates in years and there
wouldn't be too many alternatives if they were to become unavailable for some reason.

Check `LICENSES` for links to relevant projects.
