window.Surface = window.classes.Surface =
    class Surface extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior
        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
    {                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals,
        constructor()                         // etc) smaller and more cache friendly.
        {
            super("positions", "normals");    
                                           // Name the values we'll define per each vertex.
                                           //order of corners: bottm left,right and upper left, right
            this.positions.push(...Vec.cast([-5, 0, 0], [5, 0, 0], [-5, 14, 0], [5, 14, 0]));   // Specify the 4 square corner locations.
            this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]));   // Match those up with normal vectors.
            //this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1], [1, 1]));   // Draw a square in texture coordinates too.
            this.indices.push(0, 1, 2, 1, 3, 2);                   // Two triangles this time, indexing into four distinct vertices.
        }
    };

window.Points_Rectangle = window.classes.Three_Points_Rectangle =
    class Three_Points_Rectangle extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior
        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
    {                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals,
        constructor()                         // etc) smaller and more cache friendly.
        {
            super("positions", "normals");   
                                            // Name the values we'll define per each vertex.
                                            //order of corners: bottm left,right and upper left, right
            this.positions.push(...Vec.cast([-5, 14, 0], [5, 14, 0], [-5, 16, 0], [5, 16, 0]));   // Specify the 4 square corner locations.
            this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]));   // Match those up with normal vectors.
            //this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1], [1, 1]));   // Draw a square in texture coordinates too.
            this.indices.push(0, 1, 2, 1, 3, 2);                   // Two triangles this time, indexing into four distinct vertices.
        }
    };
 
window.Ball = window.classes.Ball =
    class Ball extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior
        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
    {                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals,
        constructor()                         // etc) smaller and more cache friendly.
        {
            super("positions", "normals");   
                                            // Name the values we'll define per each vertex.
                                            //order of corners: bottm left,right and upper left, right
            this.positions.push(...Vec.cast([-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1]));   // Specify the 4 square corner locations.
            this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]));   // Match those up with normal vectors.
            //this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1], [1, 1]));   // Draw a square in texture coordinates too.
            this.indices.push(0, 1, 2, 1, 3, 2);                   // Two triangles this time, indexing into four distinct vertices.
        }
    };
window.Energy_Bar = window.classes.Energy_Bar =
    class Energy_Bar extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior
        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
    {                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals,
        constructor()                         // etc) smaller and more cache friendly.
        {
            super("positions", "normals");   
                                            // Name the values we'll define per each vertex.
                                            //order of corners: bottm left,right and upper left, right
            this.positions.push(...Vec.cast([-20, 0, 0], [-16, 0, 0], [-20, 2, 0], [-16, 2, 0]));   // Specify the 4 square corner locations.
            this.normals.push(...Vec.cast([0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]));   // Match those up with normal vectors.
            //this.texture_coords.push(...Vec.cast([0, 0], [1, 0], [0, 1], [1, 1]));   // Draw a square in texture coordinates too.
            this.indices.push(0, 1, 2, 1, 3, 2);                   // Two triangles this time, indexing into four distinct vertices.
        }
    };
window.Angle_Stick = window.classes.Angle_Stick =
    class Angle_Stick extends Shape              // A square, demonstrating two triangles that share vertices.  On any planar surface, the interior
        // edges don't make any important seams.  In these cases there's no reason not to re-use data of
    {                                       // the common vertices between triangles.  This makes all the vertex arrays (position, normals,
        constructor()                         // etc) smaller and more cache friendly.
        {
            super("positions", "normals");   
                                            // Name the values we'll define per each vertex.
                                            //order of corners: bottm left,right and upper left, right
            this.positions.push(...Vec.cast([-0.1, 0, 1.5], [0.1, 0, 1.5], [-0.1, 4, 1.5], [0.1, 4, 1.5]));   // Specify the 4 square corner locations.
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
            context.globals.graphics_state.camera_transform = Mat4.translation([5, -10, -30]);  // Locate the camera here (inverted matrix).
            context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);
            //Adding shapes on the screen
            const shapes = {
                'surface': new Surface(),
                'points': new Points_Rectangle(),
                'ball': new Ball(),
                'energyBar': new Energy_Bar(),
                'angleLine': new Angle_Stick()
            };
            //initial variables
            this.numberOfBalls=4;
            this.friction= 0.1 + Math.random() / 7;
            this.length=20;
            this.width=10;
            this.ballMass=0.5;
            this.score={}
            this.restart=false;
            this.energyBar=false;
            this.initialBallPosX= 0;
            this.initialBallPosY=0;
            this.angleStickStillness=false;
            this.scaleValue=0;
            this.angleValue=0;
            this.angleStillTime=0;
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
            this.key_triggered_button("Energy Level - Shoot", ["Enter"], () => this.energyBar = () => this.energyBar= !this.energyBar);
            this.key_triggered_button("Restart", ["R"], () => this.restart = () => this.restart= !this.restart);
            this.key_triggered_button("Angle Control", ["A"], () => this.angleStickStillness = () => this.angleStickStillness= !this.angleStickStillness);
        }
        //display the initial scene
        initial_scene(graphics_state,model_transform){
            const surfaceColor = Color.of(213/255, 213/255, 213/255, 1), onePointColor = Color.of(7/255, 1, 15/255, 1),
                twoPointsColor = Color.of(0, 176/255, 6/255, 1), threePointsColor = Color.of(0, 115/255, 4/255, 1);
            //draw the rectangular surface
            this.shapes.surface.draw(graphics_state, model_transform, this.plastic.override({color:surfaceColor }));
            //draw three rectangles on the surface representing points
            model_transform = Mat4.identity();
            //draw the rectangular surface
            //for three points
            model_transform=Mat4.identity();
            //1 point
            this.shapes.points.draw(graphics_state, model_transform, this.plastic.override({color: onePointColor}));
            model_transform=model_transform.times(Mat4.translation([0,2,0]));
            //2 points
            this.shapes.points.draw(graphics_state, model_transform, this.plastic.override({color: twoPointsColor}));
            model_transform=model_transform.times(Mat4.translation([0,2,0]));
            //3 points
            this.shapes.points.draw(graphics_state, model_transform, this.plastic.override({color: threePointsColor}));
            return model_transform;
        }
        //calculating final destination
        distance_calculator_helper(speed,rotation){
            //TODO: animation base on time
            let kinetic = this.ballMass * Math.pow(speed, 2) / 2,
            distance = kinetic / this.friction / this.ballMass;
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
            //------------------- DRAW  THE ANGLE STICK
            model_transform= Mat4.identity();
            //rotation 
            if(!this.angleStickStillness){
                rotationAngle= -1 * Math.sin(angleStickTime)/2;
                this.angleValue = rotationAngle;
                this.angleStillTime = angleStickTime;
            }
            else{
                rotationAngle = this.angleValue;
                //----------- TODO ----------
                 //NOTE: NOT SURE HOW TO FIX THE ROTATION WHEN THE USER WANTS TO STOP IT AT A CERTAIN ANGLE
                // SO WE CAN USE THAT ANGLE FOR TRANSLATION OF THE BALL
            }
            model_transform= model_transform.times( Mat4.rotation( rotationAngle, Vec.of(0, 0, 1 ) ) );
            this.shapes.angleLine.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(1,1,0,1)}))
            //--------------- DRAW ENERGY BAR--------------
            //------------------ TODO----------------
            //NOTE: Only one sofar, with animation we should translate it higher two time and repeat until the user press a button 
            model_transform= Mat4.identity();
            var scaleValue=0;
            scaleValue = 3+ 3*Math.sin(energyBarTime);
            let scale = [[1,0,0,0],[0, scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];

            model_transform = model_transform.times(scale);
            //this implementation uses a random number to show a energy bar no animation is being used
            //I think we should use animation tho
            let color_scale = Math.sin(energyBarTime) * 0.5;
            if(!this.energyBar){
                this.scaleValue = scaleValue;
                this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0.5 + color_scale, 0, 0.5 - color_scale, 1)}));
                //model_transform= model_transform.times(Mat4.translation([0,3,0]))
                // this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(1,0,0,1)}));
                // model_transform= model_transform.times(Mat4.translation([0,3,0]))
                // this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(1,0,0,1)}));
            }
            //if the user pressed 'Energy Level'
            //A random energy bar would be chosen
            else{
                let scale = [[1,0,0,0],[0, this.scaleValue ,0,0],[0,0,1,0],[0,0,0,1]];
                model_transform= Mat4.identity().times(scale);
                let still_color_scale = (this.scaleValue-3)/3 * 0.5;

                this.shapes.energyBar.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0.5 + still_color_scale, 0, 0.5 - still_color_scale, 1)}));
                //energy level is between 1,3 inclusive
                //TODO 
                // DEFINE A BETTER SPEED THAT MAKE A BETTER TRANSLATION FOR THE GIVEN SURFACE
                var speed = (this.scaleValue)+1 //???
            }
            //----------------- Draw Ball: Blue Square ----------------
            model_transform= Mat4.identity()
            //calculating distance. returning an object for X and Y position 
            // distance.x and distance.y
<<<<<<< HEAD
            var distance = this.distance_calculator_helper(speed,rotationAngle);
=======
            var distance = this.distance_calculator_helper(speed,this.angleValue+Math.PI/2);
>>>>>>> 5b81df7145d3eed0bdf4b88777f9e2279e03bbf1
            //use final destination
            //-----------------TODO---------------------------- 
            //BALL TRANSFORMATION USING THE FINAL LOCATION DOESN'T WORK NOW
            model_transform = model_transform.times(Mat4.translation([this.initialBallPosX  + distance.x, this.initialBallPosY + distance.y,0]))
            this.shapes.ball.draw(graphics_state, model_transform, this.plastic.override({color: Color.of(0,0,1,1)}))
            
        }
    };
