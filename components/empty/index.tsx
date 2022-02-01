import { CSSProperties, VNodeTypes, inject, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { defaultConfigProvider } from '../config-provider';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import { filterEmpty } from '../_util/props-util';
import { withInstall } from '../_util/type';

const defaultEmptyImg = <DefaultEmptyImg />;
const simpleEmptyImg = <SimpleEmptyImg />;

interface Locale {
  description?: string;
}

export interface EmptyProps {
  prefixCls?: string;
  class?: any;
  style?: string | CSSProperties;
  imageStyle?: CSSProperties;
  image?: VNodeTypes | null;
  description?: VNodeTypes;
}

const Empty = defineComponent({
  name: 'AEmpty',
  inheritAttrs: false,
  props: ['prefixCls', 'image', 'description', 'imageStyle'],
  setup() {
    return {
      configProvider: inject('configProvider', defaultConfigProvider),
    };
  },
  render() {
    const { getPrefixCls, direction } = this.configProvider;
    const {
      prefixCls: customizePrefixCls = '',
      image = defaultEmptyImg,
      description = this.$slots.description?.() || undefined,
      imageStyle = {},
      class: className = '',
      ...restProps
    } = { ...this.$props, ...this.$attrs };

    return (
      <LocaleReceiver
        componentName="Empty"
        children={(locale: Locale) => {
          const prefixCls = getPrefixCls('empty', this.prefixCls);
          const des = typeof description !== 'undefined' ? description : locale.description;
          const alt = typeof des === 'string' ? des : 'empty';
          let imageNode: EmptyProps['image'] = null;

          if (typeof image === 'string') {
            imageNode = <img alt={alt} src={image} />;
          } else {
            imageNode = image;
          }

          return (
            <div
              class={classNames(prefixCls, className, {
                [`${prefixCls}-normal`]: image === simpleEmptyImg,
                [`${prefixCls}-rtl`]: direction === 'rtl',
              })}
              {...restProps}
            >
              <div class={`${prefixCls}-image`} style={imageStyle}>
                {imageNode}
              </div>
              {des && <p class={`${prefixCls}-description`}>{des}</p>}
              {this.$slots.default && (
                <div class={`${prefixCls}-footer`}>{filterEmpty(this.$slots.default())}</div>
              )}
            </div>
          );
        }}
      />
    );
  },
});

Empty.PRESENTED_IMAGE_DEFAULT = defaultEmptyImg;
Empty.PRESENTED_IMAGE_SIMPLE = simpleEmptyImg;

export default withInstall(Empty);
