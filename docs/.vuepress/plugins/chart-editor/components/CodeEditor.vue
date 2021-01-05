<template>
  <div class="code-editor">
    <div class="code-editor-header">
      <div class="code-editor-tabs">
        <button
          v-for="(section, index) in sections"
          :class="{ active: current === index }"
          :key="index"
          class="code-editor-tab"
          @click="current = index"
        >
          {{ section.name }}
        </button>
      </div>

      <div class="code-editor-tools">
        <i v-if="modified" class="code-editor-tool fas fa-bahai fa-spin text-muted"/>
        <tooltip v-else-if="error">
          <i class="code-editor-tool fas fa-exclamation-triangle text-error"/>
          <template #content>
            <pre style="white-space: pre-wrap">{{ error }}</pre>
          </template>
        </tooltip>
        <a
          :href="sourceLink"
          class="code-editor-tool fab fa-github fa-lg"
          title="View on GitHub"
          target="_blank"
        />
      </div>
    </div>

    <div class="code-editor-views">
      <component
        v-for="(section, index) in sections"
        v-show="current === index"
        v-bind="section.attrs"
        :value="section.value()"
        :is="section.component"
        :key="index"
        v-on="section.on"
      />
    </div>
  </div>
</template>

<script>
import { Parser } from 'acorn';

// Components
import EditorOutput from './EditorOutput.vue';
import EditorTextarea from './EditorTextarea.vue';
import Tooltip from './Tooltip.vue';

const BLOCK_REGEX = /^\s*<(\/?)block:([\w\s]+)(?::(\d+))?>\s*$/;

export default {
  components: {
    EditorOutput,
    EditorTextarea,
    Tooltip,
  },

  props: {
    delay: {
      type: Number,
      default: 500,
    },
    error: {
      type: Error,
      default: null,
    },
    messages: {
      type: Array,
      default: () => [],
    },
    output: {
      type: [Boolean, String],
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    blocks: [],
    current: 0,
    modified: false,
    sections: [],
  }),

  computed: {
    sourceLink() {
      const path = this.$page.relativePath;
      const config = this.$site.themeConfig;
      const repo = config.docsRepo || config.repo;
      const branch = config.docsBranch || 'master';
      const dir = config.docsDir || '';
      return `https://github.com/${repo}/blob/${branch}/${dir}/${path}`;
    },
  },

  watch: {
    value: {
      immediate: true,
      handler() {
        this.rebuild();
      },
    },
  },

  methods: {
    rebuild() {
      try {
        const me = this;
        const blocks = this.parse(this.value);
        const sections = blocks
          .filter(({ name }) => !!name)
          .sort((v0, v1) => v0.order - v1.order)
          .map((block) => ({
            component: EditorTextarea,
            value: () => block.code,
            name: block.name,
            on: {
              input(value) {
                block.code = value;
                me.invalidate();
              }
            }
          }));

        if (this.output) {
          sections.push({
            component: EditorOutput,
            value: () => this.messages,
            name: 'Output',
            attrs: {
              placeholder: this.output,
            }
          });
        }

        this.blocks = blocks;
        this.sections = sections;
        this.current = this.output ? sections.length - 1 : 0
      } catch (error) {
        this.$emit('update:error', error);
        this.blocks = [];
      }
    },
    invalidate() {
      if (this._timeout) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }

      const delay = this.delay;
      if (!delay) {
        this.update();
        return;
      }

      this.modified = true;
      this._timeout = setTimeout(() => {
        this.modified = false;
        this._timeout = null;
        this.update();
      }, delay);
    },
    update() {
      this.$emit('input', this.blocks.map(({ code }) => code).join(''));
    },
    parse(value) {
      const blocks = [];
      let current = {
        order: 0,
        start: 0,
        end: 0,
      };

      Parser.parse(value, {
        ecmaVersion: 2016,
        onComment(block, text, start, end) {
          const match = text.match(BLOCK_REGEX);
          if (!match) {
            return;
          }

          const open = !match[1];
          const name = match[2];
          const order = match[3];
          if (!open && current.name !== name) {
            return;
          }

          blocks.push({ ...current, end: start });
          current = {
            name: open ? name : undefined,
            order: order || 0,
            start: end + 1,
            end: end + 1,
          };
        }
      });

      if (current) {
        blocks.push({ ...current, end: value.length });
      }

      return blocks
        .filter(({ start, end }) => start < end)
        .map(({ name, start, end, order }) => ({
          code: value.slice(start, end),
          order,
          name,
        }));
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '../styles/palette.styl'

$tab-spacing = 16px

.code-editor
  background-color $codeBgColor
  border-radius $border-radius

  @media (max-width: $MQMobileNarrow)
    &
      border-radius 0 !important
      margin 0 -1.5rem

.code-editor-header
  background rgba(white, 0.02)
  padding 0 $tab-spacing
  display flex

  .code-editor-tab,
  .code-editor-tool
    margin 0 ($tab-spacing / 2)

.code-editor-tabs
  align-items center
  display flex
  flex 1

.code-editor-tab
  background none
  border none
  border-bottom 2px solid transparent
  color $code-text-color
  text-transform capitalize
  user-select none
  font-weight bold
  cursor pointer
  padding 20px 4px 18px 4px

  &:focus
    outline none

  &.active
    border-bottom-color $accentColor

.code-editor-tools
  align-items center
  display flex
  padding 16px 0

.code-editor-tool
  color $code-text-color
  text-decoration none !important

.code-editor-views
  height 360px
</style>
