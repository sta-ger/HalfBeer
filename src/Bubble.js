export class Bubble {

    constructor() {
        this.initialize();
    }

    initialize() {
        this._raius = Math.random() * 5;
        this._asset = this.createAsset();
    }

    createAsset() {
        let g;
        g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF, Math.random());
        g.drawCircle(0, 0, this._raius);
        return g;
    }

    getDisplay() {
        return this._asset;
    }
}