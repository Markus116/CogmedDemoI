"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
///<reference path="./pixi.d.ts" />
/*///<reference path="./pixi/index.d.ts" />*/
var core_1 = require('@angular/core');
var pixi_1 = require("./pixi");
var pixi_2 = require('./pixi');
//import
var GamePage = (function () {
    function GamePage(navCtrl) {
        //this.stage = new PIXI.Stage(0x66FF99);
        this.navCtrl = navCtrl;
        // create a renderer instance
        this.renderer = pixi_2.PIXI.autoDetectRenderer(400, 300);
        // add the renderer view element to the DOM
        document.body.appendChild(this.renderer.view);
        pixi_1.window.requestAnimFrame(this.animate);
        // create a texture from an image path
        var texture = pixi_2.PIXI.Texture.fromImage("./assets/circle01.png");
        // create a new Sprite using the texture
        this.bunny = new pixi_2.PIXI.Sprite(texture);
        // center the sprites anchor point
        this.bunny.anchor.x = 0.5;
        this.bunny.anchor.y = 0.5;
        // move the sprite t the center of the screen
        this.bunny.position.x = 200;
        this.bunny.position.y = 150;
        this.stage.addChild(this.bunny);
    }
    GamePage.prototype.animate = function () {
        pixi_1.window.requestAnimFrame(this.animate);
        // just for fun, lets rotate mr rabbit a little
        this.bunny.rotation += 0.1;
        // render the stage
        this.renderer.render(this.stage);
    };
    GamePage = __decorate([
        core_1.Component({
            templateUrl: 'build/pages/game/game.html'
        })
    ], GamePage);
    return GamePage;
}());
exports.GamePage = GamePage;
