//= require "shaders/lib/lights"

shared uniform int PASS;
shared uniform float ConstantAttenuation;
shared uniform float LinearAttenuation;
shared uniform float QuadraticAttenuation;

void main(void) {
  if (PASS != 0) {
    cache(float, LightDistanceFromSurface) { LightDistanceFromSurface = 1.0; }
    cache(float, SpotAttenuation) { SpotAttenuation = 1.0; }

    float multiplier = 1.0;
    import(AttenuationMultiplier, multiplier *= AttenuationMultiplier);

    // the SkipAttenuation stuff will be optimized out by the compiler since it will
    // be essentially become a set of constant expressions
    int skipAttenuation = 0;
    import(SkipAttenuation, skipAttenuation += SkipAttenuation);
  
    if (skipAttenuation == 0)
      multiplier *= SpotAttenuation;
      gl_FragColor.rgb *= multiplier / (ConstantAttenuation +
                                 LinearAttenuation * LightDistanceFromSurface +
                                 QuadraticAttenuation * pow(LightDistanceFromSurface, 2.0));
  }
}
