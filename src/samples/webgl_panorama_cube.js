import THREE from "../libs/three/index"

export class webgl_panorama_cube {
    constructor()
    {
        this.init();
        this.animate();
    }

    init()
    {
        this.renderer = new THREE.WebGLRenderer({canvas});
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.z = 0.01;
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.controls.rotateSpeed = - 0.25;
        const textures = this.getTexturesFromAtlasFile( "res/textures/cube/sun_temple_stripe.jpg", 6 );
        const materials = [];
        for ( let i = 0; i < 6; i ++ ) {
            materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
        }
        const skyBox = new THREE.Mesh( new THREE.CubeGeometry( 1, 1, 1 ), materials );
        skyBox.geometry.scale( 1, 1, - 1 );
        this.scene.add( skyBox );
    }

    getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

        const textures = [];

        for ( let i = 0; i < tilesNum; i ++ ) {

            textures[ i ] = new THREE.Texture();

        }

        const imageObj = new Image();

        imageObj.onload = function() {

            let canvas, context;
            const tileWidth = imageObj.height;

            for ( let i = 0; i < textures.length; i ++ ) {

                canvas = document.createElement( 'canvas' );
                context = canvas.getContext( '2d' );
                canvas.height = tileWidth;
                canvas.width = tileWidth;
                context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
                textures[ i ].image = canvas
                textures[ i ].needsUpdate = true;

            }

        };

        imageObj.src = atlasImgUrl;

        return textures;

    }

    animate = () => {

        window.requestAnimationFrame( this.animate );

        this.controls.update(); // required when damping is enabled

        this.renderer.render( this.scene, this.camera );

    }
}