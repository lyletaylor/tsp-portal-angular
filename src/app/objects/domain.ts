import { ID } from './id';

export class Domain {
    id: number;
    properties: {
        name: string;
        description: string;
        status: string;
    }

    parents: number[];
    children: number[];

    area: number;
};