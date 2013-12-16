var main = (function(){
  var gl, program, buffer, texture0, texture1, a_position, a_tex_coord, u_sampler0, u_sampler1, texture0_loaded = false, texture1_loaded = false;

  function main_function(){
    var canvas = $("#webgl_canvas")[0];

    gl = getWebGLContext(canvas);

    init_program();
    clear_color();
    init_buffer();
    init_texture();
    load_texture({
      url: '../images/example.jpg',
      texture: texture0,
      sampler_location: u_sampler0,
      texture_number: gl.TEXTURE0,
      tex: 0,
      loaded: texture0_loaded
    });

    load_texture({
      url: '../images/mask.jpg',
      texture: texture1,
      sampler_location: u_sampler1,
      texture_number: gl.TEXTURE1,
      tex: 1,
      loaded: texture1_loaded
    });
  }

  function init_program(){
    var VERTEX_SHADER = [
      'precision mediump float;',
      'attribute vec2 a_position;',
      'attribute vec2 a_tex_coord;',
      'varying vec2 v_tex_coord;',

      'void main(){',
      '  gl_Position = vec4(a_position, 0.0, 1.0);',
      '  v_tex_coord = a_tex_coord;',
      '}'
    ].join('\n');


    var FRAGMENT_SHADER = [
      'precision mediump float;',
      'varying vec2 v_tex_coord;',
      'uniform sampler2D u_sampler0;',
      'uniform sampler2D u_sampler1;',
      'void main(){',
      '  vec4 color1 = texture2D(u_sampler0, v_tex_coord);',
      '  vec4 color2 = texture2D(u_sampler1, v_tex_coord);',
      '  gl_FragColor = color1 * color2;',
      '}'
    ].join('\n');

    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    a_position = gl.getAttribLocation(program, "a_position");
    a_tex_coord = gl.getAttribLocation(program, "a_tex_coord");
    u_sampler0 = gl.getUniformLocation(program, "u_sampler0");
    u_sampler1 = gl.getUniformLocation(program, "u_sampler1");
    gl.enableVertexAttribArray(a_position);
    gl.enableVertexAttribArray(a_tex_coord);
    gl.useProgram(program);
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_buffer(){
    buffer = gl.createBuffer();

    var quad_positions = new Float32Array([
      -0.5, 0.5, 0.0, 1.0,
      0.5, 0.5, 1.0, 1.0,
      -0.5, -0.5, 0.0, 0.0,
      0.5, -0.5, 1.0, 0.0
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quad_positions, gl.DYNAMIC_DRAW);
  }

  function init_texture(){
    texture0 = gl.createTexture();
    texture1 = gl.createTexture();
  }


  function load_texture(params){

    var image = new Image();

    image.onload = function(){
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.activeTexture(params.texture_number)
      gl.bindTexture(gl.TEXTURE_2D, params.texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(params.sampler_location, params.tex);
      if (params.tex == 0) {
        texture0_loaded = true;
      } else {
        texture1_loaded = true;
      }


      if (texture0_loaded && texture1_loaded){
        draw();
      }

    }

    image.src = params.url;
    
  }

  function draw(){
    clear_color();
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(a_tex_coord, 2, gl.FLOAT, false, 16, 8);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  return main_function;
})();
