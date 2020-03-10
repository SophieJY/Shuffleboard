class Ball {
    constructor(player1or2) {
        this.init_pos_vec = Vec.of(0,2,14);
        this.pos_vec = Vec.of(0,2,14);
        this.vel_vec = Vec.of(0,0,0);
        this.player = player1or2;
        this.existence = false;
        this.waiting = true;
        this.speed = 0;
        this.radian_vector = Vec.of(0,0,0);
        this.animationStartTime = 0;
    }
    update_friction_effect(friction_factor=0) {
        this.vel_vec[0] = this.vel_vec[0] * (1-friction_factor);
        this.vel_vec[1] = this.vel_vec[1] * (1-friction_factor);
        this.vel_vec[2] = this.vel_vec[2] * (1-friction_factor);
    }
    update_velocity_effect() {
        this.speed = Math.sqrt(Math.pow(this.vel_vec[0],2) + Math.pow(this.vel_vec[1],2) + Math.pow(this.vel_vec[2],2));
        const radian_x = Math.acos(this.vel_vec[0]/this.speed);
        const radian_y = Math.PI/2;
        const radian_z = Math.acos(this.vel_vec[2]/this.speed);
        this.radian_vector = Vec.of(radian_x, radian_y, radian_z);
    }
    init_pos_vec;
    pos_vec;
    vel_vec;
    player;
    existence;
    animationStartTime;
}
window.Cube = window.classes.Cube =
class Cube extends Shape
{ constructor()
    { super( "positions", "normals" ); // Name the values we'll define per each vertex.  They'll have positions and normals.

      // First, specify the vertex positions -- just a bunch of points that exist at the corners of an imaginary cube.
      this.positions.push( ...Vec.cast( [-1,-1,-1], [1,-1,-1], [-1,-1,1], [1,-1,1], [1,1,-1],  [-1,1,-1],  [1,1,1],  [-1,1,1],
                                        [-1,-1,-1], [-1,-1,1], [-1,1,-1], [-1,1,1], [1,-1,1],  [1,-1,-1],  [1,1,1],  [1,1,-1],
                                        [-1,-1,1],  [1,-1,1],  [-1,1,1],  [1,1,1], [1,-1,-1], [-1,-1,-1], [1,1,-1], [-1,1,-1] ) );
      // Supply vectors that point away from eace face of the cube.  They should match up with the points in the above list
      // Normal vectors are needed so the graphics engine can know if the shape is pointed at light or not, and color it accordingly.
      this.normals.push(   ...Vec.cast( [0,-1,0], [0,-1,0], [0,-1,0], [0,-1,0], [0,1,0], [0,1,0], [0,1,0], [0,1,0], [-1,0,0], [-1,0,0],
                                        [-1,0,0], [-1,0,0], [1,0,0],  [1,0,0],  [1,0,0], [1,0,0], [0,0,1], [0,0,1], [0,0,1],   [0,0,1],
                                        [0,0,-1], [0,0,-1], [0,0,-1], [0,0,-1] ) );

               // Those two lists, positions and normals, fully describe the "vertices".  What's the "i"th vertex?  Simply the combined
               // data you get if you look up index "i" of both lists above -- a position and a normal vector, together.  Now let's
               // tell it how to connect vertex entries into triangles.  Every three indices in this list makes one triangle:
      this.indices.push( 0, 1, 2, 1, 3, 2, 4, 5, 6, 5, 7, 6, 8, 9, 10, 9, 11, 10, 12, 13,
                        14, 13, 15, 14, 16, 17, 18, 17, 19, 18, 20, 21, 22, 21, 23, 22 );
      // It stinks to manage arrays this big.  Later we'll show code that generates these same cube vertices more automatically.
    }
};

window.Board = window.classes.Board =
    class Board extends Shape    // A cube inserts six square strips into its arrays.
    { constructor()
    { super( "positions", "normals", "texture_coords" );
        for( var i = 0; i < 3; i++ )
            for( var j = 0; j < 2; j++ )
            { var square_transform = Mat4.rotation( i == 0 ? Math.PI/2 : 0, Vec.of(1, 0, 0) )
                .times( Mat4.rotation( Math.PI * j - ( i == 1 ? Math.PI/2 : 0 ), Vec.of( 0, 1, 0 ) ) )
                .times( Mat4.translation([ 0, 0, 1 ]) );
                Square.insert_transformed_copy_into( this, [], square_transform );
            }
    }
    }

window.Angle_Stick = window.classes.Angle_Stick =
    class Angle_Stick extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior
        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
    {                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals,
        constructor()                         // etc) smaller and more cache friendly.
        {
            super("positions", "normals");   
                                            // Name the values we'll define per each vertex.
                                            //order of corners: bottm left,right and upper left, right
            this.positions.push(...Vec.cast([-0.05, 0, 1.5], [0.05, 0, 1.5], [-0.01, 2, 1.5], [0.01, 2, 1.5]));   // Specify the 4 square corner locations.
            this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]));   // Match those up with normal vectors.
            //this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1], [1, 1]));   // Draw a square in texture coordinates too.
            this.indices.push(0, 1, 2, 1, 3, 2);                   // Two triangles this time, indexing into four distinct vertices.
        }
    };

window.Shuffle_Board_Scene = window.classes.Shuffle_Board_Scene =
    class Shuffle_Board_Scene extends Scene_Component {
        constructor(context, control_box) {
            // The scene begins by requesting the camera, shapes, and materials it will need.
            super(context, control_box);
            // First, include a secondary Scene that provides movement controls:
            if (!context.globals.has_controls)
                context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

            const r = context.width / context.height;
            context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,40 ), Vec.of( 0,2,0 ), Vec.of( 0,5,0 ) ); // Locate the camera here (inverted matrix).
            this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);
            //Adding shapes on the screen
            const shapes = {
                'surface': new Board(),
                'ball': new Subdivision_Sphere(4),
                'energyBar': new Cube(),
                'angleLine': new Angle_Stick(),
                'plane': new Square(),
                'background': new LargeSquare()
            };

            //initial variables
            this.numberOfBalls=6;
            this.numberOfBalls_on_plane=0;
            this.currentBall=0;
            this.friction= 0.8;
            this.length=20;
            this.width=10;
            this.score={};
            this.restart=false;
            this.energyBarStill=false;
            this.angleStickStillness=false;
            this.scaleValue=0;
            this.shooting_angle=0
            this.shooting_speed=0;
            this.shooting_vel_vec=Vec.of(0,0,0);
            this.cameraViewNormal = true;
            this.ball_radius = 1.0;
            this.inelasticity_factor = 0.9;
            this.speed_thresh = 0.3;
            this.p1Score=0;
            this.p2Score=0;
            this.whoWon=0// 1 for p1, 2 for p2, and 3 for drew
            this.game_is_over=false
            //for audio
            this.bgm = new Audio("assets/background.mp3");
            this.bgm.loop = true;
            this.bgm.volume = 0.8;
            this.sign_Matrix = Mat4.identity().times( Mat4.scale( [4, 4, 4 ]));
            //erase
            this.first_frame = true;

            this.ballArray =
                [new Ball(1), new Ball(2), new Ball(1), new Ball(2), new Ball(1), new Ball(2)];
            // At the beginning of our program, load one of each of these shape
            // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
            // design.  Once you've told the GPU what the design of a cube is,
            // it would be redundant to tell it again.  You should just re-use
            // the one called "box" more than once in display() to draw
            // multiple cubes.  Don't define more than one blueprint for the
            // same thing here.

            this.submit_shapes(context, shapes);
            this.materials={
                //red ball
                ball1:      context.get_instance( Texture_Rotate ).material( Color.of(0,0,0,1), { ambient: 1, texture: context.get_instance( "assets/ball1.jpeg", true) }),
                //blue ball
                ball2:      context.get_instance( Texture_Rotate ).material( Color.of(0,0,0,1), { ambient: 1, texture: context.get_instance( "assets/ball2.jpeg", true ) } ),
                ball1_still:      context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1), { ambient: 1, texture: context.get_instance( "assets/ball1.jpeg", true ) } ),
                ball2_still:      context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1), { ambient: 1, texture: context.get_instance( "assets/ball2.jpeg", true ) } ),
                p1wins:           context.get_instance( Fake_Bump_Map ).material( Color.of( 0, 0, 0,1 ), { ambient: .8, diffusivity: .5, specularity: .5 , texture: context.get_instance( "assets/p1win.png", false )  } ),
                p2wins:           context.get_instance( Fake_Bump_Map ).material( Color.of( 0, 0, 0,1 ), { ambient: .8, diffusivity: .5, specularity: .5 , texture: context.get_instance( "assets/p2win.png", false )  } ),
                drew:           context.get_instance( Fake_Bump_Map ).material( Color.of( 0, 0, 0,1 ), { ambient: .8, diffusivity: .5, specularity: .5 , texture: context.get_instance( "assets/drew.jpg", false )  } ),
                energyBar_material:  context.get_instance( Phong_Shader ).material( Color.of( 40/255, 60/255, 80/255, 1), {ambient: 0}, {diffusivity: 1}, {specularity: 0}, {smoothness: 1} ),
                surface_materrial: context.get_instance( Phong_Shader ).material( Color.of( 1 ,0, 1 ,1 ), { ambient: 1 } ),
                board_materrial: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1), { ambient: 1, texture: context.get_instance( "assets/texture_board.jpg", true ) } ),
                background_material: context.get_instance( Phong_Shader ).material( Color.of(0,0,0,1), { ambient: 1, texture: context.get_instance( "assets/background.jpg", true ) } ),
            };
            // Make some Material objects available to you:
            this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
                ambient: .4,
                diffusivity: .4
            });
            //this.white = context.get_instance(Basic_Shader).material();
            this.plastic = this.clay.override({specularity: .6});

            this.lights = [new Light(Vec.of(0, 5, 5, 1), Color.of(1, .4, 1, 1), 100000)];
        
        }
        //RESET THE GAME
        reset(){
            delete this.ballArray;
            this.ballArray = [new Ball(1), new Ball(2), new Ball(1), new Ball(2), new Ball(1), new Ball(2)];
            this.energyBarStill = false;
            this.angleStickStillness=false;
            this.numberOfBalls=6;
            this.currentBall=0;
            this.numberOfBalls_on_plane=0;
            this.p1Score=0;
            this.p2Score=0;
            this.whoWon=0
            this.game_is_over=false
            this.sign_Matrix = Mat4.identity().times( Mat4.scale( [4, 4, 4 ]));
        }
        //helper to return points depending on where the ball is on the surface
        calculate_points_helper(pos){
            //2 points for the bottom one
            if(pos[0]>-7.5 && pos[0]<7.5 && pos[2]<=-14 && pos[2]>-18){
                return 1
            }
            //middle one
            if(pos[0]>-7.5 && pos[0]<7.5 && pos[2]<=-18 && pos[2]>-22){
                return 2
            }
            //last one
            if(pos[0]>-7.5 && pos[0]<7.5 && pos[2]<=-22 && pos[2]>-26){
                return 3
            }
            return 0
        }
        wait(ms){
            var d = new Date();
            var d2 = null;
            do { d2 = new Date(); }
            while(d2-d < ms);
        }
        //calculates points after finishing all players played
        calculate_points(){
            //iterate through all balls
            for(var i=0; i< this.numberOfBalls;i++){
                var currBall= this.ballArray[i]
                //if current ball exist on the surface
                if(currBall.existence){
                    //if current ball is for P1
                    if(currBall.player==1){
                        this.p1Score+=this.calculate_points_helper(currBall.pos_vec)
                    }
                    else{
                        this.p2Score+=this.calculate_points_helper(currBall.pos_vec)
                    }
                }
            }
            //assign whoWon number to be used in displaying as well
            this.whoWon= this.p1Score> this.p2Score ? 1: this.p1Score<this.p2Score ? 2: 3;
        }
        make_control_panel()             // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        {
            this.control_panel.innerHTML += "-------------------------------- WELCOME TO SHUFFLEBOARD --------------------------------<br> Player with the most points will win<br>Each player has 3 balls to shoot<br>You'll get 1,2, or 3 points respectively depending on which green surface your ball lands<br>------------------ Start Playing! -----------------------<br>1. Fix the Angle Stick at an angle you desire"; this.new_line()
            this.key_triggered_button("Angle Control", ["A"], () => { this.angleStickStillness= !this.angleStickStillness}); 
            this.new_line()
            this.live_string(box => box.textContent = "2. Choose the Energy Level for the desired speed");
            this.new_line();
            this.live_string(box => box.textContent = "The cube with transformation on the left represents the energy");
            this.new_line();
            this.key_triggered_button("Energy Level - Shoot", ["Enter"], () =>{ this.energyBarStill= !this.energyBarStill});
            this.new_line();
            this.live_string(box => box.textContent = "---------- Switch between players OR Restart the game ----------");
            this.new_line()
            this.key_triggered_button("Switch Player", ["S"], () => {
                this.energyBarStill = false;
                this.angleStickStillness=false;
                this.currentBall += 1;
                if (this.currentBall < this.numberOfBalls) {
                    this.ballArray[this.currentBall].existence = true;
                }
                else{
                    this.calculate_points()
                    this.game_is_over=true
                }
            });
            this.key_triggered_button("Restart", ["R"], this.reset);
            this.new_line()
            this.live_string(box => box.textContent = "------------ Camera View Controller ------------");
            this.new_line();
            this.key_triggered_button( "Attach to Angle-Stick",     [ "X" ], () => {
                this.attached = () => this.angle_attach;
                this.cameraViewNormal = false;
            } );
            this.key_triggered_button( "Normal View",  [ "V" ], () => {
                this.attached = () => this.initial_camera_location;
                this.cameraViewNormal = true;
            } );
        }
        //display the initial scene
        initial_scene(graphics_state,model_transform){
            const surfaceColor = Color.of(213/255, 213/255, 213/255, 1), onePointColor = Color.of(7/255, 1, 15/255, 1),
                twoPointsColor = Color.of(0, 176/255, 6/255, 1), threePointsColor = Color.of(0, 115/255, 4/255, 1);
            //draw the rectangular-cube with rotation of Math.PI/8 arounf x-axis  surface
            model_transform= model_transform.times(Mat4.rotation(Math.PI/8,Vec.of(1,0,0))).times(Mat4.scale([7,1,14]));
            this.shapes.surface.draw(graphics_state, model_transform, this.materials.board_materrial);
            //draw three rectangles on the surface representing points
            //draw the rectangular surface
            //for three points
            model_transform=Mat4.identity();
            //1 point
            model_transform= model_transform.times(Mat4.rotation(Math.PI/8,Vec.of(1,0,0))).times(Mat4.scale([7,1,2])).times(Mat4.translation([0,0,-8]));
            this.shapes.surface.draw(graphics_state, model_transform, this.materials.surface_materrial.override({color: onePointColor}));
            model_transform=model_transform.times(Mat4.translation([0,0,-2]));
            //2 points
            this.shapes.surface.draw(graphics_state, model_transform, this.materials.surface_materrial.override({color: twoPointsColor}));
            model_transform=model_transform.times(Mat4.translation([0,0,-2]));
            //3 points
            this.shapes.surface.draw(graphics_state, model_transform, this.materials.surface_materrial.override({color: threePointsColor}));
            // this.ballArray[0].existence = true;
            // this.numberOfBalls_on_plane += 1;
            return model_transform
        }
        //calculating final destination
        value_to_vector (distance,rotation){
            return {
                x:  distance * Math.cos(rotation),
                y:  distance * Math.sin(rotation),
              };
        }
        //update position vector
        update_pos (graphics_state) {
            //d = vt + 1/2at^2
            let distanceTraveled = this.ballArray[this.currentBall].speed * (graphics_state.animation_time / 1000 - this.ballArray[this.currentBall].animationStartTime)
                - 1 / 2 * this.friction * (graphics_state.animation_time / 1000 - this.ballArray[this.currentBall].animationStartTime) * (graphics_state.animation_time / 1000 - this.ballArray[this.currentBall].animationStartTime);

            //calculating distance
            //returning an object for X and Y position
            //distance.x and distance.y
            let distanceVector = this.value_to_vector(distanceTraveled, this.shooting_angle + Math.PI / 2);
            //console.log(this.ballArray[this.currentBall].init_pos_vec[0] + distanceVector.x);
            // console.log("x:" + distanceVector.x);
            // console.log("y:" + distanceVector.y);
            return Vec.of(this.ballArray[this.currentBall].init_pos_vec[0] + distanceVector.x, 2, this.ballArray[this.currentBall].init_pos_vec[2] - distanceVector.y );
        }

        //update_pos updated
        update_pos_mod (graphics_state,i) {
            const dt = 0.05
            // let distanceTraveled = this.ballArray[i].init_speed * (graphics_state.animation_time / 1000 - this.ballArray[i].animationStartTime)
            //     - 1 / 2 * this.friction * (graphics_state.animation_time / 1000 - this.ballArray[i].animationStartTime) * (graphics_state.animation_time / 1000 - this.ballArray[i].animationStartTime);
            // let distanceVector = this.value_to_vector(distanceTraveled, this.shooting_angle + Math.PI / 2);
            // let angle = Math.atan(this.ballArray[i].pos_vec[0]/this.ballArray[i].pos_vec[1]);
            // return Vec.of(this.ballArray[i].init_pos_vec[0] + distanceVector.x, 2, this.ballArray[i].init_pos_vec[2] - distanceVector.y );
            return Vec.of(this.ballArray[i].pos_vec[0] + this.ballArray[i].vel_vec[0]*dt, this.ballArray[i].pos_vec[1] + this.ballArray[i].vel_vec[1]*dt, this.ballArray[i].pos_vec[2] + this.ballArray[i].vel_vec[2]*dt);
        }

        //update velocity vector
        update_vel (graphics_state) {
            let currentSpeed = this.ballArray[this.currentBall].speed - this.friction * (graphics_state.animation_time/1000 - this.ballArray[this.currentBall].animationStartTime);
            let velocityVector = this.value_to_vector(currentSpeed, this.shooting_angle + Math.PI / 2);
            //console.log("x:" + velocityVector.x);
            //console.log("y:" +velocityVector.y);
            return Vec.of(velocityVector.x, 0, -velocityVector.y );
        }   
        
        //update velocity updated
        update_vel_mod (graphics_state,i) {
            // let currentSpeed = this.ballArray[i].init_speed - this.friction * (graphics_state.animation_time/1000 - this.ballArray[i].animationStartTime);
            const dt = 0.01
            let currentSpeed = this.ballArray[i].speed - this.friction * dt;
            let velocityVector = this.value_to_vector(currentSpeed, this.shooting_angle + Math.PI / 2);
            

            return Vec.of(velocityVector.x, 0, -velocityVector.y );
        }
        //helper function to ensure that the ball is on the surface
        ball_on_the_surface(pos, ballIndex){
            if(pos[0]>-7.5 && pos[0]<7.5 && pos[2]>-26 && pos[2]<14.5){
                return true
            }
            else{
                this.ballArray[ballIndex].existence=false
                return false
            }
        }

        print_vector(vec) {
            for(let i=0; i<2; i++) {
                console.log("x: ", vec[0], "y: ", vec[1], "z: ", vec[2])
            }
        }

        check_collision_xzplane(ball1, ball2) {
            const dist_between = Math.sqrt(Math.pow((ball1.pos_vec[0] - ball2.pos_vec[0]),2) + Math.pow((ball1.pos_vec[1] - ball2.pos_vec[1]),2)+ Math.pow((ball1.pos_vec[2] - ball2.pos_vec[2]),2));
            // console.log(dist_between);
            if(dist_between <= this.ball_radius*2) {
                return true;
            } else {
                return false;
            }
        }

        draw_background(graphics_state) {
            let model_transform= Mat4.identity().times(Mat4.rotation(Math.PI/8 + 1/2 * Math.PI,Vec.of(1,0,0))).times(Mat4.translation([0,0,1]));
            this.shapes.background.draw(graphics_state, model_transform, this.materials.background_material );
            model_transform= Mat4.identity().times(Mat4.rotation(Math.PI/8 ,Vec.of(1,0,0))).times(Mat4.translation([0,0,-80]));
            this.shapes.background.draw(graphics_state, model_transform, this.materials.background_material );
            model_transform= Mat4.identity().times(Mat4.rotation(Math.PI/2 ,Vec.of(0,1,0))).times(Mat4.translation([0,0,-100]));
            this.shapes.background.draw(graphics_state, model_transform, this.materials.background_material );
            model_transform= Mat4.identity().times(Mat4.rotation(Math.PI/2 ,Vec.of(0,1,0))).times(Mat4.translation([0,0,100]));
            this.shapes.background.draw(graphics_state, model_transform, this.materials.background_material );
        }

        perform_collision_effect(ball1, ball2) {
            const dist_between = Math.sqrt(Math.pow((ball1.pos_vec[0] - ball2.pos_vec[0]),2) + Math.pow((ball1.pos_vec[1] - ball2.pos_vec[1]),2)+ Math.pow((ball1.pos_vec[2] - ball2.pos_vec[2]),2));
            let collision_tangent_1 = ball1.pos_vec.minus(ball2.pos_vec)
            collision_tangent_1.scale(1/dist_between);


            const collision_parallel_comp_1 = ball1.vel_vec.dot(collision_tangent_1);
            const collision_parallel_comp_2 = ball2.vel_vec.dot(collision_tangent_1);

            const collision_tangent_2 = collision_tangent_1.copy();

            collision_tangent_1.scale((collision_parallel_comp_2 - collision_parallel_comp_1)*this.inelasticity_factor);
            collision_tangent_2.scale((collision_parallel_comp_1 - collision_parallel_comp_2)*this.inelasticity_factor);
            ball1.vel_vec = ball1.vel_vec.plus(collision_tangent_1);
            ball2.vel_vec = ball2.vel_vec.plus(collision_tangent_2);
            ball1.update_velocity_effect()
            ball2.update_velocity_effect()
        }

        print_ball(ball) {
            console.log(ball.pos_vec)
            console.log(ball.vel_vec)
            console.log(ball.speed)
            console.log(ball.player)
        }

        //display objects on the screen
        display(graphics_state) {
            
            //play background music
            //this.bgm.play();

            //draw background
            this.draw_background(graphics_state);

            const dt = graphics_state.animation_delta_time / 1000;
            const angleStickTime = graphics_state.animation_time/300;
            const energyBarTime = graphics_state.animation_time/200;
            const friction_factor = 0.005;
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            //End the game if it's over
            if(this.game_is_over ){
                document.getElementById('p1').innerHTML = "Player1: " + this.p1Score.toString();
                document.getElementById('p2').innerHTML = "Player2: " + this.p2Score.toString();
                document.getElementById('winner').innerHTML =  this.p1Score> this.p2Score ? "The Winner is Player1": this.p1Score< this.p2Score? "The Winner is Player2" :"Drew";
                this.sign_Matrix = this.sign_Matrix.times( Mat4.translation( [0,0.5* Math.sin(dt), 2*Math.sin(dt)]) )
                var color= this.whoWon==1? this.materials.p1wins: this.whoWon==2? this.materials.p2wins: this.materials.drew;
                this.shapes.plane.draw(graphics_state, this.sign_Matrix,color );
                setTimeout(() => {  this.reset(); }, 3000);
            }
            let model_transform =  Mat4.identity();
            model_transform = this.initial_scene( graphics_state, model_transform);

            // let rotationAngle;
            // create the initial scene with the surface of the game
            // //------------------- DRAW  THE ANGLE STICK ---------
            //rotation 
            if(!this.angleStickStillness){
                this.shooting_angle = -1 * Math.sin(angleStickTime)/4;
            } 
            // else {
            //     console.log(this.shooting_angle)
            // }

            //  else {
            //     rotationAngle = this.shooting_angle;
            // }
            //draw the angle stick based on the surface cordinates
            model_transform = model_transform.times(Mat4.rotation(-Math.PI/2,Vec.of(1,0,0))).times(Mat4.translation([0,-19.2,0])).times(Mat4.rotation(this.shooting_angle,Vec.of(0,0,1)));
            this.shapes.angleLine.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(1,1,0,1)}));
            this.angle_attach= model_transform;
            //--------------- DRAW ENERGY BAR--------------
            model_transform= Mat4.identity();
            let scaleValue;
            scaleValue = 3+ 3*Math.sin(energyBarTime);
            let scale = [[1,0,0,0],[0, scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
            model_transform = model_transform.times(Mat4.rotation(Math.PI/8,Vec.of(1,0,0))).times(Mat4.translation([0,-1,3])).times(scale).times(Mat4.translation([-15,0,0])).times(Mat4.scale([2,2,1]));
            //Animate the the Energy Bar until the user presses 'Enter'
            let color_scale = Math.sin(energyBarTime) * 0.5;
            if(!this.energyBarStill){
                this.scaleValue = scaleValue;
                this.shapes.energyBar.draw(graphics_state, model_transform, this.materials.energyBar_material.override({color: Color.of(0.5 + color_scale, 0, 0.5 - color_scale, 1)}));
                //FORCE TO RESTART IF ALL BALL USED, CALCULATE POINTS
                if(this.currentBall<6){
                    this.ballArray[this.currentBall].animationStartTime = graphics_state.animation_time/1000;
                }
                
            
            }
            //Fix the Energy Bar after the user pressed the enter
            else{
                let scale = [[1,0,0,0],[0, this.scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
                model_transform= Mat4.identity().times(Mat4.rotation(Math.PI/8,Vec.of(1,0,0))).times(Mat4.translation([0,-1,3])).times(scale).times(Mat4.translation([-15,0,0])).times(Mat4.scale([2,2,1]));
                let still_color_scale = (this.scaleValue-3)/3 * 0.5;

                this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0.5 + still_color_scale, 0, 0.5 - still_color_scale, 1)}));
                // this.ballArray[this.currentBall].init_speed = this.scaleValue+3;
                this.shooting_speed = this.scaleValue;
            }

            // SHOOT
            if(this.angleStickStillness && this.energyBarStill && this.ballArray[this.currentBall].waiting) {
                // console.log(this.shooting_speed)
                console.log(this.shooting_angle)
                let tester = 0.78/0.25
                this.ballArray[this.currentBall].vel_vec[0] = -1 * this.shooting_speed * Math.asin(this.shooting_angle);
                this.ballArray[this.currentBall].vel_vec[2] = -1 * this.shooting_speed * Math.acos(this.shooting_angle);
                // this.ballArray[this.currentBall].vel_vec[0] = 0.4
                // this.ballArray[this.currentBall].vel_vec[1] = 0.
                // this.ballArray[this.currentBall].vel_vec[2] = -3.
                // this.ballArray[this.currentBall].vel_vec = (this.shooting_vel_vec).copy();
                this.ballArray[this.currentBall].waiting = false;
                this.ballArray[this.currentBall].existence = true;
                this.ballArray[this.currentBall].update_velocity_effect();
                this.numberOfBalls_on_plane += 1;
                // console.log(this.shooting_vel_vec);
            }
            //----------------- Draw Ball ----------------
            
            //update position vector based on speed and animation start time
            //vf = vi + at
            //FORCE TO RESTART IF ALL BALL USED, CALCULATE POINTS
            // if(this.currentBall>5){
            //     //TO DO
            //     //CALL A HELPER FUNCTION TO CALCULATE THE POINTS THEN REST
            //     //FOR NOW
            //     this.reset()
            // }
            // //IF THERE ARE BALLS LEFT OVER
            if(this.currentBall<6){
                // let timeTraveled = this.ballArray[this.currentBall].init_speed/this.friction;
                // if (graphics_state.animation_time/1000 - this.ballArray[this.currentBall].animationStartTime < timeTraveled) {
                //     this.ballArray[this.currentBall].pos_vec = this.update_pos(graphics_state);
                //     //console.log(this.ballArray[this.currentBall].pos_vec);
                //     this.ballArray[this.currentBall].vel_vec = this.update_vel(graphics_state);
                // }
                // if(this.energyBarStill) {
                //     //make the current ball visible
                //     this.ballArray[this.currentBall].existence = true;
                // }
                
                //Check for collision
                for(let i=0; i<this.numberOfBalls_on_plane; i++) {
                    for(let j=i+1; j<this.numberOfBalls_on_plane; j++) {
                        if (this.check_collision_xzplane(this.ballArray[i], this.ballArray[j])){
                            // console.log(this.ballArray[i].vel_vec);
                            this.perform_collision_effect(this.ballArray[i], this.ballArray[j]);
                            // console.log(this.ballArray[i].vel_vec);
                        }
                    }
                }

                //iterate through the ball array and modify ball object
                for(let i = 0; i < this.numberOfBalls_on_plane; i++) {
                    // this.print_ball(this.ballArray[i])
                    if (this.ballArray[i].speed > this.speed_thresh) {
                        this.ballArray[i].pos_vec = this.update_pos_mod(graphics_state, i);
                        this.ballArray[i].update_friction_effect(friction_factor)
                        this.ballArray[i].update_velocity_effect();
                    } else {
                        this.ballArray[i].speed = 0;
                    }
                }
                //helper function to calculate
              

                //iterate through the ball array and draw each existing balls
                for(let i = 0; i < this.numberOfBalls_on_plane; i++) {
                    let curr_ball = this.ballArray[i];
                    //draw the balls based on their existence
                    if (curr_ball.existence && this.ball_on_the_surface(curr_ball.pos_vec, i)){
                        
                        //console.log(curr_ball.pos_vec[0]);
                        // this.print_ball(curr_ball)
                        model_transform = Mat4.identity().times(Mat4.rotation(Math.PI / 8, Vec.of(1, 0, 0)))
                            .times(Mat4.translation([curr_ball.pos_vec[0], curr_ball.pos_vec[1], curr_ball.pos_vec[2]]));
                        if(curr_ball.speed!=0){
                            this.shapes.ball.draw(graphics_state, model_transform, curr_ball.player===1 ? this.materials.ball1 : this.materials.ball2);
                        }
                        else{
                            this.shapes.ball.draw(graphics_state, model_transform, curr_ball.player===1 ? this.materials.ball1_still : this.materials.ball2_still);
                        }
                        // console.log("here")
                    }
                }
            
            }
            // // draw sample balls for debugging
            // for(let i = 0; i < this.sample_balls.length; i++) {
            //     let curr_ball = this.sample_balls[i];
            //     model_transform = Mat4.identity().times(Mat4.rotation(Math.PI / 8, Vec.of(1, 0, 0)))
            //         .times(Mat4.translation([curr_ball.pos_vec[0], curr_ball.pos_vec[1], curr_ball.pos_vec[2]]));
            //     this.shapes.ball.draw(graphics_state, model_transform, curr_ball.player===1 ? this.materials.ball1 : this.materials.ball2);
            //     console.log("here")
            // }

            //attached function
            if(this.attached != undefined) {
                if(!this.cameraViewNormal) {
                    var desired = Mat4.inverse(this.attached().times(Mat4.translation([0, -2, 2]).times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))));
                    desired = desired.map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, .1));
                    graphics_state.camera_transform = desired;
                } else {
                    var desired = Mat4.inverse(this.attached().times(Mat4.translation([0, 0, 0])));
                    desired = desired.map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, .1));
                    graphics_state.camera_transform = desired;
                }
              }

            //TEST STATION/////////////////////////////////////////////////////////////////////////
            
            // const initial_ball_pos = [Vec.of(0.,2.,15.), Vec.of(1.,2.,-5.), Vec.of(3.,2.,-7.), Vec.of(-1.,2.,-7.)];
            // const initial_ball_vel = [Vec.of(0.4,0,-5), Vec.of(0,0,0), Vec.of(0,0,0), Vec.of(0,0,0)];
            // const test_ball_count=initial_ball_pos.length;
            // // const speed_thresh = 0.1;

            // if(this.first_frame){
            //     this.first_frame = false;
            //     for(let i = 0; i < test_ball_count; i++) {
            //         this.ballArray[i].pos_vec = initial_ball_pos[i];
            //         this.ballArray[i].vel_vec = initial_ball_vel[i];
            //         this.ballArray[i].update_velocity_effect();
            //         // console.log(this.ballArray[i].speed);
            //     }
            // }

            // console.log("per frame")


            // //Check for collision
            // for(let i=0; i<test_ball_count; i++) {
            //     for(let j=i+1; j<test_ball_count; j++) {
            //         if (this.check_collision_xzplane(this.ballArray[i], this.ballArray[j])){
            //             // console.log(this.ballArray[i].vel_vec);
            //             this.perform_collision_effect(this.ballArray[i], this.ballArray[j]);
            //             // console.log(this.ballArray[i].vel_vec);
            //         }
            //     }
            // }

            // //iterate through the ball array and modify ball object
            // for(let i = 0; i < test_ball_count; i++) {
            //     if (this.ballArray[i].speed > this.speed_thresh) {
            //         // console.log("here",i)
            //         this.ballArray[i].pos_vec = this.update_pos_mod(graphics_state, i);
            //         this.ballArray[i].update_friction_effect(friction_factor)
            //         this.ballArray[i].update_velocity_effect();
            //     } else {
            //         this.ballArray[i].speed = 0;
            //     }
            // }

            // //iterate through the ball array and draw each existing balls
            // for(let i = 0; i < test_ball_count; i++) {
            //     let curr_ball = this.ballArray[i];
            //     this.print_ball(curr_ball)
            //     model_transform = Mat4.identity().times(Mat4.rotation(Math.PI / 8, Vec.of(1, 0, 0)))
            //         .times(Mat4.translation([curr_ball.pos_vec[0], curr_ball.pos_vec[1], curr_ball.pos_vec[2]]));
            //     this.shapes.ball.draw(graphics_state, model_transform, curr_ball.player===1 ? this.materials.ball1 : this.materials.ball2);
            // }


            //TEST STATION-end///////////////////////////////////////////////////////////////////////////


            // let rotationAngle;
            //create the initial scene with the surface of the game
            // // //------------------- DRAW  THE ANGLE STICK ---------
            // //rotation 
            // if(!this.angleStickStillness){
            //     rotationAngle= -1 * Math.sin(angleStickTime)/4;
            //     this.shooting_angle = rotationAngle;
            // } else{
            //     rotationAngle = this.shooting_angle;
            // }
            // //draw the angle stick based on the surface cordinates
            // model_transform= model_transform.times(Mat4.rotation(-Math.PI/2,Vec.of(1,0,0))).times(Mat4.translation([0,-19.5,0])).times(Mat4.rotation(rotationAngle,Vec.of(0,0,1)));
            // this.shapes.angleLine.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(1,1,0,1)}));
            // this.angle_attach= model_transform;
            // //--------------- DRAW ENERGY BAR--------------
            // model_transform= Mat4.identity();
            // let scaleValue;
            // scaleValue = 3+ 3*Math.sin(energyBarTime);
            // let scale = [[1,0,0,0],[0, scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
            // model_transform = model_transform.times(scale).times(Mat4.translation([-20,0,0])).times(Mat4.scale([2,2,1]));
            // //Animate the the Energy Bar until the user presses 'Enter'
            // let color_scale = Math.sin(energyBarTime) * 0.5;
            // if(!this.energyBarStill){
            //     this.scaleValue = scaleValue;
            //     this.shapes.energyBar.draw(graphics_state, model_transform, this.materials.energyBar_material.override({color: Color.of(0.5 + color_scale, 0, 0.5 - color_scale, 1)}));
            //     //FORCE TO RESTART IF ALL BALL USED, CALCULATE POINTS
            //     if(this.currentBall>5){
            //         //TO DO
            //         //CALL A HELPER FUNCTION TO CALCULATE THE POINTS THEN REST
            //         //FOR NOW
            //         this.reset()
            //     }
            //     else{
            //         this.ballArray[this.currentBall].animationStartTime = graphics_state.animation_time/1000;
            //     }
            // }
            // //Fix the Energy Bar after the user pressed the enter
            // else{
            //     let scale = [[1,0,0,0],[0, this.scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
            //     model_transform= Mat4.identity().times(scale).times(Mat4.translation([-20,0,0])).times(Mat4.scale([2,2,1]));
            //     let still_color_scale = (this.scaleValue-3)/3 * 0.5;

            //     this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0.5 + still_color_scale, 0, 0.5 - still_color_scale, 1)}));
            //     this.ballArray[this.currentBall].init_speed = this.scaleValue+3;
            // }
            // //----------------- Draw Ball ----------------

            // //update position vector based on speed and animation start time
            // //vf = vi + at
            // //FORCE TO RESTART IF ALL BALL USED, CALCULATE POINTS
            // if(this.currentBall>5){
            //     //TO DO
            //     //CALL A HELPER FUNCTION TO CALCULATE THE POINTS THEN REST
            //     //FOR NOW
            //     this.reset()
            // }
            // //IF THERE ARE BALLS LEFT OVER
            // else{
            //     let timeTraveled = this.ballArray[this.currentBall].init_speed/this.friction;
            //     if (graphics_state.animation_time/1000 - this.ballArray[this.currentBall].animationStartTime < timeTraveled) {
            //         this.ballArray[this.currentBall].pos_vec = this.update_pos(graphics_state);
            //         //console.log(this.ballArray[this.currentBall].pos_vec);
            //         this.ballArray[this.currentBall].vel_vec = this.update_vel(graphics_state);
            //     }
            //     if(this.energyBarStill) {
            //         //make the current ball visible
            //         this.ballArray[this.currentBall].existence = true;
            //     }

            //     //iterate through the ball array and draw each existing balls
            //     for(let i = 0; i < this.numberOfBalls; i++) {
            //         let curr_ball = this.ballArray[i];  
            //         //draw the balls based on their existence
            //         if (curr_ball.existence) {

            //             if( this.ball_on_the_surface(curr_ball.pos_vec)){
            //                 //console.log(curr_ball.pos_vec[0]);
            //                 model_transform = Mat4.identity().times(Mat4.rotation(Math.PI / 8, Vec.of(1, 0, 0)))
            //                     .times(Mat4.translation([curr_ball.pos_vec[0], curr_ball.pos_vec[1], curr_ball.pos_vec[2]]));
            //                 this.shapes.ball.draw(graphics_state, model_transform, curr_ball.player===1 ? this.materials.ball1 : this.materials.ball2);
            //             }
        
                        
            //         }
                    
            //     }
            // }
            // //attached function
            // if(this.attached != undefined) {
            //     if(!this.cameraViewNormal) {
            //         var desired = Mat4.inverse(this.attached().times(Mat4.translation([0, -2, 2]).times(Mat4.rotation(Math.PI / 2, Vec.of(1, 0, 0)))));
            //         desired = desired.map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, .1));
            //         graphics_state.camera_transform = desired;
            //     } else {
            //         var desired = Mat4.inverse(this.attached().times(Mat4.translation([0, 0, 0])));
            //         desired = desired.map((x, i) => Vec.from(graphics_state.camera_transform[i]).mix(x, .1));
            //         graphics_state.camera_transform = desired;
            //     }
            //   }
        }
    };
    //FOR THE BALL TEXTURE
    class Texture_Rotate extends Phong_Shader
    { fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
        {
          // TODO:  Modify the shader below (right now it's just the same fragment shader as Phong_Shader) for requirement #7.
          return `
            uniform sampler2D texture;
            void main()
            { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
              { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
                return;
              }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                                // Phong shading is not to be confused with the Phong Reflection Model.
              vec2 mVector = f_tex_coord; 
              mat4 mMatrix = mat4(cos( mod((6.28) * .25 * animation_time, 44. * 3.14)), sin( mod((6.28) * .25 * animation_time, 44. * 3.14)), 0, 0, -sin( mod((6.28) * .25 * animation_time, 44. * 3.14)), cos( mod((6.28) * .25 * animation_time, 44. * 3.14)), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              vec4 tempVector = vec4(mVector, 0, 0); 
              tempVector = tempVector + vec4(-.5, -.5, 0., 0.);
              tempVector = mMatrix * tempVector; 
              tempVector = tempVector + vec4(.5, .5, 0., 0.);
              
              vec4 tex_color = texture2D( texture, tempVector.xy );                         // Sample the texture image in the correct place.
                                                                                          // Compute an initial (ambient) color:
              if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
              else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
              gl_FragColor.xyz += phong_model_lights( N );                     // Compute the final color with contributions from lights.
            }`;
        }
    }
    class Fake_Bump_Map extends Phong_Shader                         // Same as Phong_Shader, except this adds one line of code.
    { fragment_glsl_code()           // ********* FRAGMENT SHADER ********* 
        { return `
            uniform sampler2D texture;
            void main()
            { if( GOURAUD || COLOR_NORMALS )    // Do smooth "Phong" shading unless options like "Gouraud mode" are wanted instead.
              { gl_FragColor = VERTEX_COLOR;    // Otherwise, we already have final colors to smear (interpolate) across vertices.            
                return;
              }                                 // If we get this far, calculate Smooth "Phong" Shading as opposed to Gouraud Shading.
                                                // Phong shading is not to be confused with the Phong Reflection Model.
              
              vec4 tex_color = texture2D( texture, f_tex_coord );                    // Use texturing as well.
              vec3 bumped_N  = normalize( N + tex_color.rgb - .5*vec3(1,1,1) );      // Slightly disturb normals based on sampling
                                                                                     // the same image that was used for texturing.
                                                                                     
                                                                                     // Compute an initial (ambient) color:
              if( USE_TEXTURE ) gl_FragColor = vec4( ( tex_color.xyz + shapeColor.xyz ) * ambient, shapeColor.w * tex_color.w ); 
              else gl_FragColor = vec4( shapeColor.xyz * ambient, shapeColor.w );
              gl_FragColor.xyz += phong_model_lights( bumped_N );                    // Compute the final color with contributions from lights.
            }`;
        }
    }
///Class Ball, vec3(, , ,) (Position pos_vec) (Velocity vel_vec) ......