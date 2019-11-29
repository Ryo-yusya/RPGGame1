"use strict";

const   CHRHEIGHT   = 24;				//　キャラの高さ
const   CHRWIDTH    = 24;				//　キャラの幅
const   CHRMOTION   = 10;				//　キャラ歩行モーションのスピード（上げれば遅くなる）
const	CHRSELECT	= 2;				//  使用キャラセレクト
const	FONT		= "12px monospace";	//	使用フォント
const	FONTSTYLE	= "#ffffff";		//  フォントスタイル
const	HEIGHT		= 312;				//	仮想画面サイズ。高さ
const	WIDTH		= 312;				//	仮想画面サイズ。幅
const	MAP_HEIGHT	= 36;				//	マップ高さ（タイル数）
const	MAP_WIDTH	= 36;				//	マップ幅（タイル数）
const	SMOOTH		= 0;				//	補完処理
const	START_X		= 8;				//	開始位置x
const	START_Y		= 10;				//	開始位置y
const	TILECOLUMN	= 20;				//	タイル列数
const	TILEROW		= 20;				//	タイル行数
const	TILESIZE	= 24;				//	タイルサイズ
const	WIDSTYLE	="rgba(0, 0, 0, 0.75)";	//ウインドウの色
const	gKey		= new Uint8Array(0x100);	//キー入力バッファ、Array（配列）

let		gAngle = 0;					//プレイヤーの向き
let		gFrame = 0;					//　内部カウンタ
let		gHeight;					//	実画面の高さ
let		gWidth;						//	実画面の幅
let		gMoveX = 0;					//　移動量X
let		gMoveY = 0;					//　移動量Y
let		gImgMap;					//	マップチップ
let		gImgPlayer;					//　プレイヤー
let     gPlayerX = START_X * TILESIZE;               //  プレイヤー座標x
let     gPlayerY = START_Y * TILESIZE;               //  プレイヤー座標y
let		gScreen;					//	仮想画面

const gFileMap = "img/map CG/map.png";			//マップチップファイル指定
const gFilePlayer = "img/charaCG/00 all charaCG1.png";	//プレイヤー画像指定


//	マップ↓
const	gMap = [
 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310,
 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310,	
 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310,
 310, 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310, 
 310, 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310, 
 310, 310, 310,   0,   0, 357, 357, 357, 357, 357, 357, 357, 357, 357,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310, 
 310, 310, 310,   0,   0, 357, 357, 357, 357, 357, 357, 357, 357, 357,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310, 
 310, 310, 310,   0,   0, 357, 357, 357,  21, 357, 357, 357, 357, 357,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0, 375, 375, 375, 375, 375, 375, 375, 375, 375,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0, 375, 375, 375, 375, 375, 375, 375, 375, 375,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0, 375, 375, 377, 377, 377, 377, 377, 377, 375,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0, 375, 375, 377, 377,  50,  50,  50, 377, 375,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0, 375, 375, 377, 377,  50, 379,  50, 377, 375,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0, 377, 377,  50,  44,  50, 377, 375,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,  45,  44,  44,  44,  44,  45,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,  45,  45,  45,  45,  45,  45,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0, 310, 310, 310,
 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310,
 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310,
 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310, 310,
];

function DrawMain()
{
	const	g = gScreen.getContext( "2d" );	//	仮想画面の2D描画コンテキスト取得
	
	let mx = Math.floor(gPlayerX / TILESIZE);	//プレイヤーのタイル座標X
	let my = Math.floor(gPlayerY / TILESIZE);	//プレイヤーのタイル座標Y	

	for( let dy = -7; dy <= 7; dy++ ){
		let y = dy + 7;
		let ty = my + dy;								//タイル座標Y
		let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;		//ループ後タイル座標Y
		for( let dx = -8; dx <= 8; dx++ ){
			let x = dx + 8;
			let tx = mx + dx;							//タイル座標X
			let	px = (tx + MAP_WIDTH) % MAP_WIDTH;		//ループ後タイル座標X
			DrawTile( g, 
					  tx * TILESIZE + WIDTH/2  - gPlayerX, 
					  ty * TILESIZE + HEIGHT/2 - gPlayerY, 
					  gMap[ py * MAP_WIDTH + px ] );
		}
	}

	//プレイヤーの描画
	g.drawImage( gImgPlayer, gAngle * CHRWIDTH , CHRSELECT * CHRHEIGHT + (Math.floor(gFrame / CHRMOTION % 2)) * CHRHEIGHT, CHRWIDTH, CHRHEIGHT, WIDTH/2 , HEIGHT/2 , CHRWIDTH, CHRHEIGHT ); //マップの中心にプレイヤー表示

	//ウインドウ
	g.fillStyle = WIDSTYLE; //ウインドウの色を設定
	g.fillRect(20, 20, 105, 15);

	g.font = FONT;			//	文字フォント設定
	g.fillStyle = FONTSTYLE;
	g.fillText( "x=" + gPlayerX + " y=" + gPlayerY + " m=" + gMap[my * MAP_WIDTH + mx], 25, 31 );
}


function DrawTile( g, x, y, idx )
{
	const		ix = ( idx % TILECOLUMN ) * TILESIZE;
	const		iy = Math.floor( idx / TILECOLUMN ) * TILESIZE;
	g.drawImage( gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE );
}

function LoadImage(){
	gImgMap = new Image();		gImgMap.src = gFileMap;		//	マップチップ読み込み
	gImgPlayer = new Image();	gImgPlayer.src = gFilePlayer;		//	プレイヤー読み込み
}

//フィールド進行処理
function TickField(){
	if(gMoveX != 0 || gMoveY != 0){}	//移動中の場合
	else if(gKey[37]) {gAngle = 2; gMoveX = -TILESIZE;}	//37は"←キー"のキーコード、左
	else if(gKey[38]) {gAngle = 1; gMoveY = -TILESIZE;}	//38は"↑キー"のキーコード、上
	else if(gKey[39]) {gAngle = 3; gMoveX = TILESIZE; }	//39は"→キー"のキーコード、右
	else if(gKey[40]) {gAngle = 0; gMoveY = TILESIZE; }	//40は"↓キー"のキーコード、下

	//　移動後（今いる位置ではない）のタイル座標判定
	let	mx1 = Math.floor((gPlayerX + gMoveX) / TILESIZE);	//移動後タイル座標x
	let	my1 = Math.floor((gPlayerY + gMoveY) / TILESIZE);	//移動後タイル座標y
	//ループ処理で移動後の座標を取得
	mx1 += MAP_WIDTH;	//　マップループ処理		
	mx1 %= MAP_WIDTH;	//　マップループ処理		
	my1 += MAP_HEIGHT;	//　マップループ処理
	my1 %= MAP_HEIGHT;	//　マップループ処理
	let	m = gMap[my1 * MAP_WIDTH + mx1];					//移動後のタイル位置
	if(m == 50 || m == 310 || m == 357 || m == 375 || m == 377){
		gMoveX = 0;		//移動禁止X
		gMoveY = 0;		//移動禁止Y
	}

	//Math.sign()：()の中身が正なら1、負なら-1、0なら0を返す
	gPlayerX += Math.sign(gMoveX);		//プレイヤー座標移動X	
	gPlayerY += Math.sign(gMoveY);		//プレイヤー座標移動Y
	gMoveX -= Math.sign(gMoveX);		//移動消費量X
	gMoveY -= Math.sign(gMoveY);		//移動消費量Y

	//マップループ処理（1ループ移動すると座標が0に戻る）
	gPlayerX += (MAP_WIDTH * TILESIZE);	//x += y;　は x = x + y;と同じ
	gPlayerX %= (MAP_WIDTH * TILESIZE);
	gPlayerY += (MAP_HEIGHT * TILESIZE);
    gPlayerY %= (MAP_HEIGHT * TILESIZE);

    //　現在のタイル座標判定
	let	mx2 = Math.floor((gPlayerX) / TILESIZE);	//　現在のタイル座標x
	let	my2 = Math.floor((gPlayerY) / TILESIZE);	//　現在のタイル座標y
	//　メインエリアに戻る
	if(mx2 == 8 && my2 == 7){
        location.href = 'index.html';
    }

    let href = location.href;
    console.log(href);
}

function WmPaint()
{
	DrawMain();

	const	ca = document.getElementById( "main" );	//	mainキャンバスの要素取得
	const	g = ca.getContext( "2d" );				//	2D描画コンテキスト取得
	g.drawImage( gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight );	//	仮想画面のイメージ
}


//	ブラウザサイズ変更イベント
function WmSize()
{
	const	ca = document.getElementById( "main" );	//	mainキャンバスの要素取得
	ca.width = window.innerWidth;					//	キャンバスの幅をブラウザの幅へ変更
	ca.height = window.innerHeight;					//	キャンバスの高さをブラウザの高さへ変更

	const	g = ca.getContext( "2d" );				//	2D描画コンテキスト取得
	g.imageSmoothingEnabled = g.msImageSmoothingEnabled = SMOOTH;	//	補完処理

	//	実画面サイズを計測。ドットのアスペクト比を維持したまま最大サイズを計測
	gWidth = ca.width;
	gHeight = ca.height;
	if( gWidth / WIDTH < gHeight / HEIGHT ){
		gHeight = gWidth * HEIGHT / WIDTH;
	}else{
		gWidth = gHeight * WIDTH / HEIGHT;
	}
}


//	タイマーイベント発生時の処理
function WmTimer()
{
	gFrame++;		//	内部カウンタを加算
	TickField();						
	WmPaint();
}

//　キー入力イベント
window.onkeydown = function(ev){
	let c = ev.keyCode;		//　キーコード取得
	gKey[c] = 1;	
}

window.onkeyup = function(ev){
	gKey[ev.keyCode] = 0;	//キーアップするとgKey[c] = 1から0になる
}

//	ブラウザ起動イベント
window.onload = function()
{
	LoadImage();

	gScreen = document.createElement( "canvas" );	//	仮想画面作成
	gScreen.width = WIDTH;							//	仮想画面の幅を設定
	gScreen.height = HEIGHT;						//	仮想画面の高さを設定

	WmSize();										//	画面サイズ初期化
	window.addEventListener( "resize", function(){ WmSize() } );	//	ブラウザサイズ変更時AWmSize()を読み込む
	setInterval( function(){ WmTimer() }, 33 );		//	33ms間隔でWmTimer呼び出し、33fps
}
