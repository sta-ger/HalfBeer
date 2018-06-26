import {Elastic, TweenMax} from "gsap";
import {Glass} from "./Glass";

export class App {
    static get GAME_WIDTH() {
        return 400;
    }

    static get GAME_HEIGHT() {
        return 400;
    }

    constructor() {
        this.initialize();
    }

    initialize() {
        this._trainingQuestions = [
            "And this one?",
            "How about this one?",
            "This one?",
            "What's this one?",
        ];
        this._predictPhrases = [
            "Looks like it is",
            "I guess it is",
            "May be it is",
            "Seems like it is",
        ];

        this._primaryButtonStyle = "ui fluid primary button";
        this._secondaryButtonStyle = "ui fluid secondary button";

        this._trainingSets = [];

        this._currentQuestionIdx = 0;
        this._currentPhraseIdx = 0;

        this._stepsBeforePredict = 20;

        this._network = new synaptic.Architect.Perceptron(2, 3, 1);

        window.onload = () => this.run();
    }

    run() {
        this._pixiApp = new PIXI.Application(App.GAME_WIDTH, App.GAME_HEIGHT, {backgroundColor : 0xFFFFFF, antialias: true});
        this._pixiApp.renderer.plugins.interaction.autoPreventDefault = false;
        this._pixiApp.renderer.view.style.touchAction = 'auto';
        this._stage = this._pixiApp.stage;
        document.getElementById("app").appendChild(this._pixiApp.view);
        this.initializeUi();
        this.drawMessage("Is the beer glass full or empty?");
        this.drawNewGlass();
    }

    initializeUi() {
        this._fullBtn = document.getElementById("full");
        this._fullBtn.onclick = () => this.onFullBtnClick();
        this._fullBtn.className = this._secondaryButtonStyle;
        this._emptyBtn = document.getElementById("empty");
        this._emptyBtn.onclick = () => this.onEmptyBtnClick();
        this._emptyBtn.className = this._secondaryButtonStyle;
        this._message = document.getElementById("message");
    }

    onFullBtnClick() {
        this.answer(1);
    }

    onEmptyBtnClick() {
        this.answer(0);
    }

    answer(val) {
        this._trainingSets.push([this._glass.beerAmount, this._glass.foamAmount, val]);
        this.train();
        this.drawNewGlass();
        if (this._trainingSets.length > this._stepsBeforePredict) {
            this.drawPredictMessage();
        } else {
            this.drawTrainingMessage();
        }
    }

    train() {
        let output;
        let i;
        let j;
        for (i = 0; i < 100; i++) {
            for (j = 0; j < this._trainingSets.length; j++) {
                output = this._network.activate([this._trainingSets[j][0], this._trainingSets[j][1]]);
                this._network.propagate(0.3, [this._trainingSets[j][2]]);
            }
        }
    }

    drawTrainingMessage() {
        let idx;
        while (idx === undefined || idx === this._currentQuestionIdx) {
            idx = Math.floor(Math.random() * this._trainingQuestions.length);
        }
        this._currentQuestionIdx = idx;
        this.drawMessage(this._trainingQuestions[this._currentQuestionIdx]);
    }

    drawPredictMessage() {
        let idx;
        let phrase;
        let predictionWord;
        let output;
        let question;
        output = this._network.activate([this._glass.beerAmount, this._glass.foamAmount]);
        if (output[0] > 0.5) {
            predictionWord = "full";
        } else {
            predictionWord = "empty";
        }

        while (idx === undefined || idx === this._currentPhraseIdx) {
            idx = Math.floor(Math.random() * this._predictPhrases.length);
        }
        this._currentPhraseIdx = idx;
        phrase = this._predictPhrases[idx];

        this.drawMessage(`${phrase} ${predictionWord}`);

        if (output[0] > 0.5) {
            this._fullBtn.className = this._primaryButtonStyle;
            this._emptyBtn.className = this._secondaryButtonStyle;
        } else {
            this._fullBtn.className = this._secondaryButtonStyle;
            this._emptyBtn.className = this._primaryButtonStyle;
        }
    }

    drawMessage(msg) {
        this.messageAlpha = 0;
        if (this._messageTween) {
            this._messageTween.kill();
        }
        this._messageTween = TweenMax.to(this, 0.75, {messageAlpha: 1});
        this._message.innerText = msg;
    }

    drawNewGlass() {
        if (this._glass) {
            TweenMax.to(this._glass.getDisplay(), 0.25, {x: -this._glass.getDisplay().width / 2, ease: Power1.easeIn, onComplete: (glass) => {
                glass.destroy();
            }, onCompleteParams: [this._glass]});
        }
        this._glass = this.createGlass();
        this._glass.drawBeer(this.getNewBeerAmount(), this.getNewFoamAmount());
        this._glass.getDisplay().x = App.GAME_WIDTH + this._glass.getDisplay().width / 2;
        this._stage.addChild(this._glass.getDisplay());
        TweenMax.to(this._glass.getDisplay(), 0.5, {x: App.GAME_WIDTH / 2, ease: Power1.easeOut});
    }

    getNewBeerAmount() {
        let val;
        let from;
        let to;
        from = 4;
        to = 5.5;
        val = Math.random() * (to - from) + from;
        val = this.scaleBetween(val, 0, 1, 0, 10);
        return val;
    }

    getNewFoamAmount() {
        let val;
        let from;
        let to;
        from = 1;
        to = 20;
        val = Math.random() * (to - from) + from;
        val = this.scaleBetween(val, 0.01, 1, 0, 100);
        return val;
    }

    scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
        return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
    }

    createGlass() {
        return new Glass();
    }

    set messageAlpha(value) {
        this._message.style.opacity = value.toString();
    }

    get messageAlpha() {
        return parseFloat(this._message.style.opacity);
    }

}