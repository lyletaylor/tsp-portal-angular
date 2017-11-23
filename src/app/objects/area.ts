import { ID } from './id';

export class Area {
    uuid: string;
    id: number;
    name: string;
    description: string;
    status: string;

    //parents: ID[];
    //children: ID[];

    constructor({ status = "Active", name = "", description = "", uuid = null, id=null, properties=null }) {
        this.id = id;

        this.uuid = properties ? properties.uuid : uuid;
        this.name = properties ? properties.name : name;
        this.description = properties ? properties.description : description;
        this.status = properties ? properties.status : status;
    }

    getRemoteObject() : Object {
        return {
            id: this.id,
            properties: {
                uuid: this.uuid,
                name: this.name,
                description: this.description,
                status: this.status
            }
        }
    }
};

