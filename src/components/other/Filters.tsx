import { hexToMatrix } from "../../utils";

// Used to color monochrome textures and add outlines to text
// Add to the style of <img>: filter: "url(#filterId)"
function Filters() {
    return (
        <>
            <svg style={{ width: 0, height: 0, position: "fixed" }}>
                <filter id="alertFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#FF0000")} />
                </filter>
                <filter id="completedNodeFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#01FF01")} />
                </filter>
                <filter id="changePlayerLocationFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#D3C59E")} />
                </filter>
                <filter id="distillerArrowFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#CDBA20")} />
                </filter>
                <filter id="fireFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#DF0909")} />
                </filter>
                <filter id="waterFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#1092E6")} />
                </filter>
                <filter id="windFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#17EBB9")} />
                </filter>
                <filter id="earthFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#D7840C")} />
                </filter>
                <filter id="lightFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#CFD341")} />
                </filter>
                <filter id="darkFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#7208DE")} />
                </filter>
                <filter id="lifeFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#EA7880")} />
                </filter>
                <filter id="blackFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#000000")} />
                </filter>
                <filter id="difficulty1Filter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#009AE3")} />
                </filter>
                <filter id="difficulty2Filter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#008012")} />
                </filter>
                <filter id="difficulty3Filter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#EFE700")} />
                </filter>
                <filter id="difficulty4Filter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#E67B00")} />
                </filter>
                <filter id="difficulty5Filter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#9E0000")} />
                </filter>
                <filter id="ultimateBarIconFilter">
                    <feColorMatrix type="matrix" values={hexToMatrix("#FBFF2F")} />
                </filter>
                {/* TODO: Better solutions for outlining? Current: https://stackoverflow.com/a/46123184 */}
                <filter id="blackOutlineFilter" colorInterpolationFilters="sRGB">
                    <feMorphology in="SourceAlpha" result="MORPH" operator="dilate" radius="1.5" />
                    <feColorMatrix
                        in="MORPH"
                        result="WHITENED"
                        type="matrix"
                        values={hexToMatrix("#000000")}
                    />
                    <feMerge>
                        <feMergeNode in="WHITENED" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="thinBlackOutlineFilter" colorInterpolationFilters="sRGB">
                    <feMorphology in="SourceAlpha" result="MORPH" operator="dilate" radius="1" />
                    <feColorMatrix
                        in="MORPH"
                        result="WHITENED"
                        type="matrix"
                        values={hexToMatrix("#000000")}
                    />
                    <feMerge>
                        <feMergeNode in="WHITENED" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="whiteOutlineFilter" colorInterpolationFilters="sRGB">
                    <feMorphology in="SourceAlpha" result="MORPH" operator="dilate" radius="1.5" />
                    <feColorMatrix
                        in="MORPH"
                        result="WHITENED"
                        type="matrix"
                        values="-1 0 0 0 1, 0 -1 0 0 1, 0 0 -1 0 1, 0 0 0 1 0"
                    />
                    <feMerge>
                        <feMergeNode in="WHITENED" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </svg>
        </>
    );
}

export default Filters;
