var main = (function(){
  var gl,
      canvas,
      program,
      triangle_buffer,
      triangle_position,
      a_position,
      u_translation;

  function main_function(){
    canvas = $("#webgl_canvas")[0];
    gl = getWebGLContext(canvas);
    
    
    clear_color();
    init_program();
    init_buffer();
    draw_triangle();
  }

  function init_program(){
    var VERTEX_SHADER = [
      "attribute vec4 a_position;",
      "uniform vec4 u_translation;",
      "void main(){",
        "gl_Position = a_position + u_translation;",
      "}"
    ].join('\n');

    var FRAGMENT_SHADER = [
      "void main(){",
        "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
      "}"
    ].join('\n');


    program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    gl.useProgram(program);
    a_position = gl.getAttribLocation(program, "a_position");
    u_translation = gl.getUniformLocation(program, "u_translation");
    gl.enableVertexAttribArray(a_position);
  }

  function clear_color(){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  function init_buffer(){
    triangle_buffer = gl.createBuffer();
    triangle_position = new Float32Array([
      0, 0.5, -0.5, -0.5, 0.5, -0.5
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle_position, gl.DYNAMIC_DRAW);

    //set uniform value
  
  }

  function draw_triangle(){
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, triangle_position, gl.DYNAMIC_DRAW);


    gl.uniform4f(u_translation, -0.2, 0.2, 0.0, 0.0);
    
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }



  return main_function;
})();
