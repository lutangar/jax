Jax.shaders['fog'] = new Jax.Shader({  common:"uniform vec4 FogColor;\n\nuniform int Algorithm;\n\nuniform float Scale;\nuniform float End;\nuniform float Density;\n\nvarying vec3 vFogFactor;\n",
  fragment:"const float LOG2 = 1.442695;\n\nvoid main(inout vec4 ambient, inout vec4 diffuse, inout vec4 specular) {\n  float fog;\n  float distance = length(gl_FragCoord.z / gl_FragCoord.w);\n\n  if (Algorithm == <%=Jax.LINEAR%>) {\n    fog = (End - distance) * Scale;\n  } else if (Algorithm == <%=Jax.EXPONENTIAL%>) {\n    fog = exp(-Density * distance);\n  } else if (Algorithm == <%=Jax.EXP2%>) {\n    fog = exp2(-Density * Density * distance * distance * LOG2);\n  } else {\n    /* error condition, output red */\n    ambient = diffuse = specular = vec4(1,0,0,1);\n    return;\n  }\n\n  fog = clamp(fog, 0.0, 1.0);\n  \n  ambient  = mix(FogColor,  ambient,  fog);\n  diffuse  = mix(FogColor,  diffuse,  fog);\n}\n",
  vertex:"shared attribute vec4 VERTEX_POSITION;\n\nshared uniform mat4 mvMatrix, pMatrix;\n\nconst float LOG2 = 1.442695;\n\nvoid main(void) {\n  vec4 pos = mvMatrix * VERTEX_POSITION;\n  gl_Position = pMatrix * pos;\n}\n",
exports: {},
name: "fog"});
