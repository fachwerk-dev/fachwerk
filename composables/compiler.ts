import { compile, RenderFunction } from "vue";

export function compileTemplate(source = "") {
  const errors: any[] = []; // CompilerError @vue/compiler-sfc
  let code: RenderFunction | undefined = undefined;
  try {
    const compiledCode = compile(source, {
      onWarn: (err: any) => {
        errors.push(err);
        return false;
      },
      onError: (err: any) => {
        errors.push(err);
        return false;
      },
    });
    code = compiledCode || (() => null);
  } catch (e) {
    errors.push(e);
  }
  return { code, errors };
}
