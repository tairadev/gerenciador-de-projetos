declare module 'v-mask' {
  import { DirectiveBinding } from 'vue';

  export const VueMaskDirective: {
    bind(el: HTMLElement, binding: DirectiveBinding): void;
    componentUpdated(el: HTMLElement, binding: DirectiveBinding): void;
    unbind(el: HTMLElement): void;
  };

  export default VueMaskDirective;
}
