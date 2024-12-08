import arachnea from 'arachnea';
import {LANGUAGES} from "./constants.js";

export class Node {
    constructor(val = "__SOURCE__", id = 0, parent = null, relationship = null) {
        this.id = id;
        this.val = val;
        this.children = [];
        this.parent = parent;
        this.relationship = relationship;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    toJson = () => {
        return {
            data: {
                "label": this.val,
                "name": this.val,
                "id": this.id,
                // "parent": this.parent?this.parent.id:null,
            }
        }
    }
}

export class Link {
    constructor(id, source, target, relationship = null) {
        this.id = id;
        this.source = source;
        this.target = target;
        this.relationship = relationship;
    }

    toJson() {
        return {
            data: {
                "id": this.id,
                "label": this.relationship?this.relationship:'',
                "source": this.source?.id,
                "target": this.target?.id,
            }
        }
    }
}

export class Transformer {
    constructor(lang, data = {}) {
        this.lang = lang;
        this.data = data;
        this.id = 0;
        this.nodes = {};
        this.links = {};
    }

    setData(data) {
        this.data = data;
        return this;
    }

    transform = () => {
        switch (this.lang) {
            case LANGUAGES.JSON:
                transformJson(this.data, this.nodeFactory, this.nodeFactory("__SOURCE__"), "source");
                return this;
            default:
                return this;
        }
    }

    nodeFactory = (val = "__SOURCE__", parent = null, relationship = null) => {
        const id = this.id;
        this.id += 1;
        this.nodes[id] = new Node(val, id, parent, relationship);
        this.generateLink(this.nodes[id], parent, relationship);
        return this.nodes[id];
    }

    generateLink(node, parent = null, relationship = null) {
        if (!parent) {
            return;
        }

        const id = node.id + '__links__' + parent.id;
        this.links[id] = new Link(id, parent, node, relationship);
    }

    getLinks = () => Object.values(this.links).map(link => link.toJson());

    getNodes = () => arachnea(Object.values(this.nodes)).map(node => node.toJson()).collect();

    getNodeNameById = (id) =>{
        return this.nodes[id].name;
    }

}

export const transformJson = (data = {}, nodeFactory = val => new Node(val), parent = null, relationship = null) => {

    if (data === undefined || data.length === 0) {
        return nodeFactory();
    }

    if (!data) {
        return nodeFactory();
    }

    switch (typeof data) {
        case 'object':
            if (Array.isArray(data)) {
                return data.map((item) => transformJson(item, nodeFactory, parent, relationship));
            }

            return Object.entries(data).map(([k, v]) => {
                if (typeof v !== 'object') {
                    return transformJson(v, nodeFactory, parent, k);
                }
                const keyNode = nodeFactory(k, parent, relationship);
                const children = transformJson(v, nodeFactory, keyNode, k);

                if (Array.isArray(children)) {
                    keyNode.children = [...children, ...parent.children];
                } else {
                    keyNode.children.push(children);
                }

                return keyNode;
            })
        case 'string':
        case 'number':
        case 'boolean':
            return nodeFactory(data, parent, relationship);
        default:
            return nodeFactory(null, parent, relationship);
    }
};