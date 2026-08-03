import type { ComputedRef } from 'vue'

interface UseHistoryShortcutsOptions {
    undo: () => void
    redo: () => void
    canUndo: ComputedRef<boolean>
    canRedo: ComputedRef<boolean>
}

const TEXT_INPUT_TYPES = new Set([
    'text',
    'number',
])

const isTextEditingTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) {
        return false
    }

    if (
        target instanceof HTMLTextAreaElement
        || target.isContentEditable
    ) {
        return true
    }

    return (
        target instanceof HTMLInputElement
        && TEXT_INPUT_TYPES.has(target.type)
    )
}

export const useHistoryShortcuts = ({undo, redo, canUndo, canRedo,}: UseHistoryShortcutsOptions): void => {
    const handleKeydown = (event: KeyboardEvent): void => {
        const hasModifier = event.ctrlKey || event.metaKey

        if (
            !hasModifier
            || event.altKey
            || event.code !== 'KeyZ'
        ) return;

        if (isTextEditingTarget(event.target)) return;

        if (document.querySelector('dialog[open]')) return;

        if (event.shiftKey) {
            if (!canRedo.value) return;

            event.preventDefault();
            redo();

            return;
        }

        if (!canUndo.value) return;

        event.preventDefault();
        undo();
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown)
    })

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', handleKeydown)
    })
}