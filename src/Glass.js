import {Bubble} from "./Bubble";
import {App} from "./App";

export class Glass {

    constructor() {
        this.initialize();
    }

    initialize() {
        this._glassHeight = App.GAME_HEIGHT;
        this._glassWidth = this._glassHeight / 2;

        this._glassInnearWidth = this._glassWidth - 15;
        this._glassInnearHeight = this._glassHeight - 20;

        this._container = new PIXI.Container();
        this._body = this.createBody();
        this._container.addChild(this._body);

        this._empty = this.createEmpty();
        this._empty.y = this._glassInnearHeight;
        this._container.addChild(this._empty);

        this._beer = this.createBeer();
        this._beer.y = this._glassInnearHeight;
        this._container.addChild(this._beer);

        this._foam = this.createFoam();
        this._foam.y = this._glassInnearHeight;
        this._container.addChild(this._foam);
    }

    drawBeer(beerAmount, foamAmount) {
        this._beerAmount = beerAmount;
        this._foamAmount = foamAmount;
        this._beerHeight = this._glassInnearHeight * beerAmount;
        this._foamHeight = this._glassInnearHeight * foamAmount;
        TweenMax.to(this._beer, 1, {
            height: this._beerHeight, ease: Elastic.easeOut.config(1, 0.6), onUpdate: () => {
                this._foam.y = this._beer.y - this._beer.height;
            }
        });
        TweenMax.to(this._foam, 1, {height: this._foamHeight, ease: Elastic.easeOut.config(1, 0.6)});
        this._isBubbleAnimation = true;
        this.bubbleAnim();
    }

    bubbleAnim() {
        let bubble;
        bubble = new Bubble();
        bubble.getDisplay().x = this._beer.x + Math.random() * (Math.random() > 0.5 ? this._glassInnearWidth /  2 : -this._glassInnearWidth  / 2);
        bubble.getDisplay().y = this._beer.y;
        this._container.addChild(bubble.getDisplay());
        TweenMax.to(bubble.getDisplay(), Math.random(), {y: this._beer.y - this._beer.height, ease: Power1.easeIn, onComplete: () => {
            this._container.removeChild(bubble.getDisplay());
        }});

        if (this._isBubbleAnimation) {
            this._bubbleAnimTimeoutId = setTimeout(() => this.bubbleAnim(), Math.random() * 100);
        }
    }

    destroy() {
        this._isBubbleAnimation = false;
        clearTimeout(this._bubbleAnimTimeoutId);
    }

    createBody() {
        let g;
        g = new PIXI.Graphics();
        g.beginFill(0xDDDDDD);
        g.drawRect(-this._glassWidth / 2, 0, this._glassWidth, this._glassHeight);
        g.endFill();
        return g;
    }

    createEmpty() {
        let g;
        g = new PIXI.Graphics();
        g.beginFill(0xEEEEEE);
        g.drawRect(-this._glassInnearWidth / 2, 0, this._glassInnearWidth, -this._glassHeight);
        g.endFill();
        return g;
    }

    createBeer() {
        let g;
        g = new PIXI.Graphics();
        g.beginFill(0xEBBD14);
        g.drawRect(-this._glassInnearWidth / 2, 0, this._glassInnearWidth, -20);
        g.endFill();
        return g;
    }

    createFoam() {
        let g;
        g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawRect(-this._glassInnearWidth / 2, 0, this._glassInnearWidth, -10);
        g.endFill();
        return g;
    }

    get beerAmount() {
        return this._beerAmount;
    }

    get foamAmount() {
        return this._foamAmount;
    }

    getDisplay() {
        return this._container;
    }

}