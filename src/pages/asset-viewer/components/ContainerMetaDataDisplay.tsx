import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FullContainerData } from "@extractor/containerExtraction";

interface Props {
    containerData: FullContainerData | undefined;
}

function ContainerMetaDataDisplay(props: Props) {
    const { containerData } = props;
    return (
        <>
            <Accordion disabled={Boolean(!containerData)} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    Container header
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Signature: {containerData?.containerHeader?.signature}</Typography>
                    <Typography>Version: {containerData?.containerHeader?.version}</Typography>
                    <Typography>
                        Unity version: {containerData?.containerHeader?.unityVersion}
                    </Typography>
                    <Typography>
                        Unity revision: {containerData?.containerHeader?.unityRevision}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion disabled={Boolean(!containerData)} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>BlockBytes info</AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Minimum streamed bytes: {containerData?.blockByteInfo?.minimumStreamedBytes}
                    </Typography>
                    <Typography>
                        AssetBundle header size: {containerData?.blockByteInfo?.abHeaderSize}
                    </Typography>
                    <Typography>
                        Number of levels to download before streaming:{" "}
                        {containerData?.blockByteInfo?.numberOfLevelsToDownloadBeforeStreaming}
                    </Typography>
                    <Typography>Level count: {containerData?.blockByteInfo?.levelCount}</Typography>
                    <Typography>
                        Compressed size: {containerData?.blockByteInfo?.compressedSize}
                    </Typography>
                    <Typography>
                        Uncompressed size: {containerData?.blockByteInfo?.uncompressedSize}
                    </Typography>
                    <Typography>Flags: {containerData?.blockByteInfo?.flags}</Typography>
                    <Typography>
                        Complete file size: {containerData?.blockByteInfo?.completeFileSize}
                    </Typography>
                    <Typography>
                        File info header size: {containerData?.blockByteInfo?.fileInfoHeaderSize}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion disabled={Boolean(!containerData)} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    AssetFileBytes info
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        Nodes count: {containerData?.assetFileBytesInfo?.nodesCount}
                    </Typography>
                    <Typography>Path: {containerData?.assetFileBytesInfo?.path}</Typography>
                    <Typography>Offset: {containerData?.assetFileBytesInfo?.offset}</Typography>
                    <Typography>Size: {containerData?.assetFileBytesInfo?.size}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion disabled={Boolean(!containerData)} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>AssetFile</AccordionSummary>
                <AccordionDetails>
                    <Accordion disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Header</AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Meta data size: {containerData?.assetFile?.header.metaDataSize}
                            </Typography>
                            <Typography>
                                File size: {containerData?.assetFile?.header.fileSize}
                            </Typography>
                            <Typography>
                                Version: {containerData?.assetFile?.header.version}
                            </Typography>
                            <Typography>
                                Data offset: {containerData?.assetFile?.header.dataOffset}
                            </Typography>
                            <Typography>
                                Endianess:{" "}
                                {JSON.stringify(containerData?.assetFile?.header.endianess)}
                            </Typography>
                            <Typography>
                                Reserved:{" "}
                                {JSON.stringify(containerData?.assetFile?.header.reserved)}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disableGutters slotProps={{ transition: { unmountOnExit: true } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Types</AccordionSummary>
                        <AccordionDetails>
                            {containerData?.assetFile?.types.map((type, index) => (
                                <Accordion disableGutters key={index}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        ClassId: {type.classId}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>ClassId: {type.classId}</Typography>
                                        <Typography>
                                            Script type index: {type.scriptTypeIndex}
                                        </Typography>
                                        <Typography>
                                            ScriptId: {JSON.stringify(type.scriptId)}
                                        </Typography>
                                        <Typography>
                                            Old type hash: {JSON.stringify(type.oldTypeHash)}
                                        </Typography>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>name</TableCell>
                                                    <TableCell>type</TableCell>
                                                    <TableCell>byteSize</TableCell>
                                                    <TableCell>version</TableCell>
                                                    <TableCell>metaFlag</TableCell>
                                                    <TableCell>level</TableCell>
                                                    <TableCell>typeStrOffset</TableCell>
                                                    <TableCell>nameStrOffset</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {type.nodes.map((node, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{node.name}</TableCell>
                                                        <TableCell>{node.type}</TableCell>
                                                        <TableCell>{node.byteSize}</TableCell>
                                                        <TableCell>{node.version}</TableCell>
                                                        <TableCell>{node.metaFlag}</TableCell>
                                                        <TableCell>{node.level}</TableCell>
                                                        <TableCell>{node.typeStrOffset}</TableCell>
                                                        <TableCell>{node.nameStrOffset}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disableGutters slotProps={{ transition: { unmountOnExit: true } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            ObjectInfos
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>classId</TableCell>
                                        <TableCell>typeId</TableCell>
                                        <TableCell>byteStart</TableCell>
                                        <TableCell>byteSize</TableCell>
                                        <TableCell>stripper</TableCell>
                                        <TableCell>pathId</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {containerData?.assetFile?.objectInfos.map((object, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{object.classId}</TableCell>
                                            <TableCell>{object.typeId}</TableCell>
                                            <TableCell>{object.byteStart}</TableCell>
                                            <TableCell>{object.byteSize}</TableCell>
                                            <TableCell>{JSON.stringify(object.stripped)}</TableCell>
                                            <TableCell>
                                                {JSON.stringify(object.pathId, (_, v) =>
                                                    typeof v === "bigint" ? v.toString() : v
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disableGutters slotProps={{ transition: { unmountOnExit: true } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Script types
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>localSerializedFileIndex</TableCell>
                                        <TableCell>localIdentifierInFile</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {containerData?.assetFile?.scriptTypes.map((script, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{script.localSerializedFileIndex}</TableCell>
                                            <TableCell>
                                                {JSON.stringify(
                                                    script.localIdentifierInFile,
                                                    (_, v) =>
                                                        typeof v === "bigint" ? v.toString() : v
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disableGutters slotProps={{ transition: { unmountOnExit: true } }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            Externals
                        </AccordionSummary>
                        <AccordionDetails>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>guid</TableCell>
                                        <TableCell>type</TableCell>
                                        <TableCell>pathName</TableCell>
                                        <TableCell>fileName</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {containerData?.assetFile?.externals.map((external, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{JSON.stringify(external.guid)}</TableCell>
                                            <TableCell>{external.type}</TableCell>
                                            <TableCell>{external.pathName}</TableCell>
                                            <TableCell>{external.fileName}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion disableGutters>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Other</AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Version: {JSON.stringify(containerData?.assetFile?.version)}
                            </Typography>
                            <Typography>
                                Build type: {containerData?.assetFile?.buildType}
                            </Typography>
                            <Typography>
                                Unity version: {containerData?.assetFile?.unityVersion}
                            </Typography>
                            <Typography>
                                Target platform: {containerData?.assetFile?.targetPlatform}
                            </Typography>
                            <Typography>
                                Enable type tree:{" "}
                                {JSON.stringify(containerData?.assetFile?.enableTypeTree)}
                            </Typography>
                            <Typography>
                                User information: {containerData?.assetFile?.userInformation}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </AccordionDetails>
            </Accordion>
        </>
    );
}

export default ContainerMetaDataDisplay;
