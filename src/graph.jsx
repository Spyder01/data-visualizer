import React, {useEffect, useRef, useMemo } from 'react';

import cytoscape from 'cytoscape';
import PropTypes from "prop-types";
import {Link, Node, Transformer} from "./lib.js";

const Graph = ({nodes, links, transformer}) => {
    const ref = useRef(null);

    const options = useMemo(() => (
        {
            container: ref.current,
            elements: {
                nodes,
                edges: links
            },
            style: [
                {
                    selector: 'node',
                    style: {
                        label: 'data(label)',
                        color: '#fff',
                    }
                    // label: (ele) => console.log(ele)
                },
                {
                    selector: 'edge',
                    style: {
                        label: 'data(label)',
                        color: '#fff',
                    }
                }
            ],
            name: 'tree',
            fit: true, // whether to fit the viewport to the graph
            padding: 30, // the padding on fit
            boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
            avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
            nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
            spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
            radius: undefined, // the radius of the circle
            startAngle: 3 / 2 * Math.PI, // where nodes start in radians
            sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
            clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
            sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
            animate: false, // whether to transition the node positions
            animationDuration: 500, // duration of animation in ms if enabled
            animationEasing: undefined, // easing of animation if enabled
            animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
            ready: undefined, // callback on layoutready
            stop: undefined, // callback on layoutstop
            transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
        }
    ), [nodes]);

    useEffect(() => {
        if (!ref.current || !options || !nodes || nodes.length === 0) {
            return;
        }

        const cy = cytoscape(options);
    }, [options, ref.current]);
    return (
        <section ref={ref} style={{height: '100%', width: '100%'}} />
    )
};

Graph.propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.objectOf(Node)).isRequired,
    links: PropTypes.arrayOf(PropTypes.objectOf(Link)).isRequired,
    transformer: PropTypes.instanceOf(Transformer),
}

export default Graph;
