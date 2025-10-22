<script lang="ts" generics="T extends string">
  /**
   * Accessible Radio Group Component
   *
   * Features:
   * - Full keyboard navigation (arrow keys, space)
   * - ARIA attributes
   * - Generic type support
   * - Visual feedback
   */

  interface Option<T> {
    value: T
    label: string
  }

  interface Props<T extends string> {
    label: string
    options: readonly Option<T>[]
    value: T
    onchange: (value: T) => void
    name?: string
  }

  // eslint-disable-next-line no-undef
  let { label, options, value, onchange, name = `radio-${Math.random()}` }: Props<T> = $props()
</script>

<fieldset class="space-y-3">
  <legend class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
    {label}
  </legend>

  <div class="space-y-2">
    {#each options as option}
      {@const isChecked = option.value === value}
      <label
        class="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
               hover:bg-gray-100 dark:hover:bg-gray-800
               {isChecked ? 'bg-blue-50 dark:bg-blue-950' : ''}"
      >
        <input
          type="radio"
          {name}
          value={option.value}
          checked={isChecked}
          onchange={() => onchange(option.value)}
          class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-700
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <span
          class="text-sm font-medium {isChecked
            ? 'text-blue-700 dark:text-blue-300'
            : 'text-gray-700 dark:text-gray-300'}"
        >
          {option.label}
        </span>
      </label>
    {/each}
  </div>
</fieldset>

<style>
  /* Custom radio button styling */
  input[type='radio'] {
    appearance: none;
    background-color: white;
    margin: 0;
    border: 2px solid currentColor;
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    display: grid;
    place-content: center;
  }

  input[type='radio']::before {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--radio-color, currentColor);
  }

  input[type='radio']:checked::before {
    transform: scale(1);
  }

  :global(.dark) input[type='radio'] {
    background-color: hsl(0, 0%, 9%);
  }
</style>
