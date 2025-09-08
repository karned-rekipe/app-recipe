/**
 * Hook personnalisé pour gérer l'état des modales d'édition
 * Respecte le principe SRP - responsable uniquement de la gestion d'état des modales
 */

import { useState, useCallback } from 'react';

interface ModalState<T = any> {
  visible: boolean;
  mode: 'add' | 'edit';
  data?: T;
  index?: number;
}

export function useModalState<T = any>(initialState?: Partial<ModalState<T>>) {
  const [modalState, setModalState] = useState<ModalState<T>>({
    visible: false,
    mode: 'add',
    data: undefined,
    index: undefined,
    ...initialState,
  });

  const openModal = useCallback((mode: 'add' | 'edit' = 'add', data?: T, index?: number) => {
    setModalState({
      visible: true,
      mode,
      data,
      index,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      visible: false,
      mode: 'add',
      data: undefined,
      index: undefined,
    });
  }, []);

  const openAddModal = useCallback(() => {
    openModal('add');
  }, [openModal]);

  const openEditModal = useCallback((data: T, index?: number) => {
    openModal('edit', data, index);
  }, [openModal]);

  return {
    modalState,
    openModal,
    closeModal,
    openAddModal,
    openEditModal,
    isVisible: modalState.visible,
    isEditMode: modalState.mode === 'edit',
    data: modalState.data,
    index: modalState.index,
  };
}
