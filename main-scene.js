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
            this.positions.push(...Vec.cast([-0.1, 0, 1.5], [0.1, 0, 1.5], [-0.1, 3, 1.5], [0.1, 3, 1.5]));   // Specify the 4 square corner locations.
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
            context.globals.graphics_state.camera_transform = Mat4.translation([5, -10, -60]);  // Locate the camera here (inverted matrix).
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);
            //Adding shapes on the screen
            const shapes = {
                'surface': new Cube(),
                'ball': new Cube(),
                'energyBar': new Cube(),
                'angleLine': new Angle_Stick()
            };
            //initial variables
            this.numberOfBalls=4;
            this.friction= 0.8;
            this.length=20;
            this.width=10;
            this.score={}
            this.restart=false;
            this.energyBarStill=false;
            this.initialBallPosX= 0;
            this.initialBallPosZ=14;
            this.angleStickStillness=false;
            this.scaleValue=0;
            this.angleValue=0;
            this.animationStartTime=0;
            this.distanceTraveled=0;
            // At the beginning of our program, load one of each of these shape
            // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
            // design.  Once you've told the GPU what the design of a cube is,
            // it would be redundant to tell it again.  You should just re-use
            // the one called "box" more than once in display() to draw
            // multiple cubes.  Don't define more than one blueprint for the
            // same thing here.
            this.submit_shapes(context, shapes);

            // Make some Material objects available to you:
            this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
                ambient: .4,
                diffusivity: .4
            });
            this.white = context.get_instance(Basic_Shader).material();
            this.plastic = this.clay.override({specularity: .6});

            this.lights = [new Light(Vec.of(0, 5, 5, 1), Color.of(1, .4, 1, 1), 100000)];
        
        }
        make_control_panel()             // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        {
            this.key_triggered_button("Energy Level - Shoot", ["Enter"], () => this.energyBarStill = () => this.energyBarStill= !this.energyBarStill);
            this.key_triggered_button("Restart", ["R"], () => this.restart = () => this.restart= !this.restart);
            this.key_triggered_button("Angle Control", ["A"], () => this.angleStickStillness = () => this.angleStickStillness= !this.angleStickStillness);
        }
        //display the initial scene
        initial_scene(graphics_state,model_transform){
            const surfaceColor = Color.of(213/255, 213/255, 213/255, 1), onePointColor = Color.of(7/255, 1, 15/255, 1),
                twoPointsColor = Color.of(0, 176/255, 6/255, 1), threePointsColor = Color.of(0, 115/255, 4/255, 1);
            //draw the rectangular-cube with rotation of Math.PI/8 arounf x-axis  surface
            model_transform= model_transform.times(Mat4.rotation(Math.PI/8,Vec.of(1,0,0))).times(Mat4.scale([7,1,14]))
            this.shapes.surface.draw(graphics_state, model_transform, this.plastic.override({color:surfaceColor }));
            //draw three rectangles on the surface representing points
            //draw the rectangular surface
            //for three points
            model_transform=Mat4.identity();
            //1 point
            model_transform= model_transform.times(Mat4.rotation(Math.PI/8,Vec.of(1,0,0))).times(Mat4.scale([7,1,2])).times(Mat4.translation([0,0,-8]))
            this.shapes.surface.draw(graphics_state, model_transform, this.plastic.override({color: onePointColor}));
            model_transform=model_transform.times(Mat4.translation([0,0,-2]));
            //2 points
            this.shapes.surface.draw(graphics_state, model_transform, this.plastic.override({color: twoPointsColor}));
            model_transform=model_transform.times(Mat4.translation([0,0,-2]));
            //3 points
            this.shapes.surface.draw(graphics_state, model_transform, this.plastic.override({color: threePointsColor}));
            return model_transform
        }
        //calculating final destination
        distance_calculator_helper(distance,rotation){
            let finalLocationObject = {
                x:  distance * Math.cos(rotation),
                y:  distance * Math.sin(rotation),
              };
           return finalLocationObject;
        }
        //display objects on the screen
        display(graphics_state) {
            const angleStickTime = this.t = graphics_state.animation_time/300;
            const energyBarTime = this.t = graphics_state.animation_time/200;
            graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
            let model_transform =  Mat4.identity();
            //set the 
            var rotationAngle=0;
            //create the initial scence with the surface of the game
            model_transform = this.initial_scene( graphics_state, model_transform);
            //------------------- DRAW  THE ANGLE STICK ---------
            // model_transform= Mat4.identity();
            //rotation 
            if(!this.angleStickStillness){
                rotationAngle= -1 * Math.sin(angleStickTime)/3;
                this.angleValue = rotationAngle;
            }
            //Fix the rotation
            else{
                rotationAngle = this.angleValue;
            }
            //draw the angle stick based on the surface cordinates
            model_transform= model_transform.times(Mat4.rotation(-Math.PI/2,Vec.of(1,0,0))).times(Mat4.translation([0,-19,0])).times(Mat4.rotation(rotationAngle,Vec.of(0,0,1)))
            this.shapes.angleLine.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(1,1,0,1)}))
            //--------------- DRAW ENERGY BAR--------------
            model_transform= Mat4.identity();
            var scaleValue=0;
            scaleValue = 3+ 3*Math.sin(energyBarTime);
            let scale = [[1,0,0,0],[0, scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
            model_transform = model_transform.times(scale).times(Mat4.translation([-20,0,0])).times(Mat4.scale([2,2,1]));
            //Animate the the Energy Bar until the user presses 'Enter'
            let color_scale = Math.sin(energyBarTime) * 0.5;
            if(!this.energyBarStill){
                this.scaleValue = scaleValue;
                this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0.5 + color_scale, 0, 0.5 - color_scale, 1)}));
                this.animationStartTime = graphics_state.animation_time/1000;
            }
            //Fix the Energy Bar after the user pressed the enter
            else{
                let scale = [[1,0,0,0],[0, this.scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
                model_transform= Mat4.identity().times(scale).times(Mat4.translation([-20,0,0])).times(Mat4.scale([2,2,1]));
                let still_color_scale = (this.scaleValue-3)/3 * 0.5;

                this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0.5 + still_color_scale, 0, 0.5 - still_color_scale, 1)}));
                //TODO 
                // DEFINE A BETTER SPEED THAT MAKE A BETTER TRANSLATION FOR THE GIVEN SURFACE
                var speed = (this.scaleValue)+3 //???
            }
            //----------------- Draw Ball: Blue Square ----------------
            model_transform= Mat4.identity()
            //calculating distance. returning an object for X and Y position 
            // distance.x and distance.y

            //vf = vi + at
            let timeTraveled = speed/this.friction;
            if (graphics_state.animation_time/1000 - this.animationStartTime < timeTraveled) {
                this.distanceTraveled = speed * (graphics_state.animation_time / 1000 - this.animationStartTime) - 1 / 2 * this.friction * (graphics_state.animation_time / 1000 - this.animationStartTime) * (graphics_state.animation_time / 1000 - this.animationStartTime);
            }
            var distance = this.distance_calculator_helper(this.distanceTraveled, this.angleValue + Math.PI / 2);
            //use final destination
            //-----------------TODO----------------------------
            //BALL TRANSFORMATION USING THE FINAL LOCATION DOESN'T WORK NOW
            //the ball works based on the surface cordinates
            model_transform = model_transform.times(Mat4.rotation(Math.PI / 8, Vec.of(1, 0, 0))).times(Mat4.translation([this.initialBallPosX + distance.x, 2, this.initialBallPosZ - distance.y]));
            if(this.energyBarStill) {
                this.shapes.ball.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0, 0, 1, 1)}))
            }
        }
    };
