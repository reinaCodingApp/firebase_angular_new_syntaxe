export class Label 
{
    id: string | null;
    title: string;

    /**
     * Constructor
     */
    constructor(label)
    {
        this.id = label.id || null; 
        this.title = label.title;
    }
}

 