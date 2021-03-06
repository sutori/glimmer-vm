import { ComponentCapabilities, ICompilableTemplate } from "@glimmer/opcode-compiler";
import { ProgramSymbolTable, Option } from "@glimmer/interfaces";
import { assert } from "@glimmer/util";
import { ComponentSpec, WithStaticLayout } from "@glimmer/runtime";
import { TestResolver, TestSpecifier } from './lazy-env';

export class LookupResolver {
  constructor(private resolver: TestResolver) {
  }

  private getComponentSpec(handle: number): ComponentSpec {
    let spec = this.resolver.resolve<Option<ComponentSpec>>(handle);

    assert(!!spec, `Couldn't find a template for handle ${handle}`);

    return spec!;
  }

  getCapabilities(handle: number): ComponentCapabilities {
    let spec = this.resolver.resolve<Option<ComponentSpec>>(handle);
    let { manager, definition } = spec!;
    return manager.getCapabilities(definition);
  }

  getLayout(handle: number): Option<ICompilableTemplate<ProgramSymbolTable>> {
    let { manager, definition } = this.getComponentSpec(handle);
    let capabilities = manager.getCapabilities(definition);

    if (capabilities.dynamicLayout === true) {
      return null;
    }

    let invocation = (manager as WithStaticLayout<any, any, TestSpecifier, TestResolver>).getLayout(definition, this.resolver);

    return {
      compile() { return invocation.handle; },
      symbolTable: invocation.symbolTable
    };
  }

  lookupHelper(name: string, referrer: TestSpecifier): Option<number> {
    return this.resolver.lookupHelper(name, referrer);
  }

  lookupModifier(name: string, referrer: TestSpecifier): Option<number> {
    return this.resolver.lookupModifier(name, referrer);
  }

  lookupComponentSpec(name: string, referrer: TestSpecifier): Option<number> {
    return this.resolver.lookupComponentHandle(name, referrer);
  }

  lookupPartial(name: string, referrer: TestSpecifier): Option<number> {
    return this.resolver.lookupPartial(name, referrer);
  }

}
