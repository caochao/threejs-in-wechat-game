import THREE from "../libs/three/index"

import * as Zlib from "../libs/three/js/libs/inflate.min"
window.Zlib = Zlib
require("../libs/three/js/loaders/FBXLoader")

require("../libs/three/js/controls/OrbitControls")

export class webgl_loader_fbx {
    constructor()
    {
        this.init();
        this.animate();
    }

    init()
    {
        this.clock = new THREE.Clock();
        this.mixers = [];
            
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
        this.camera.position.set( 100, 200, 300 );

        const controls = new THREE.OrbitControls( this.camera );
        controls.target.set( 0, 100, 0 );
        controls.update();

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0xa0a0a0 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );
        
        let light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        light.position.set( 0, 200, 0 );
        this.scene.add( light );

        light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 0, 200, 100 );
        light.castShadow = true;
        light.shadow.camera.top = 180;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -120;
        light.shadow.camera.right = 120;
        this.scene.add( light );

        // this.scene.add( new THREE.CameraHelper( light.shadow.camera ) );

        // ground
        const mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add( mesh );

        const grid = new THREE.GridHelper( 2000, 20, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add( grid );

        // model
        const loader = new THREE.FBXLoader();
        loader.load( 'res/models/fbx/Samba Dancing.fbx', function ( object ) {

            object.mixer = new THREE.AnimationMixer( object );
            this.mixers.push( object.mixer );

            const action = object.mixer.clipAction( object.animations[ 0 ] );
            action.play();

            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );

            this.scene.add( object );
        } );

        this.renderer = new THREE.WebGLRenderer( { antialias: true, canvas:canvas } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true;
    }

    animate = () => {
        requestAnimationFrame( this.animate );

        if ( this.mixers.length > 0 ) {
            for ( let i = 0; i < this.mixers.length; i ++ ) {
                this.mixers[ i ].update( this.clock.getDelta() );
            }
        }

        this.renderer.render( this.scene, this.camera );
    }
}