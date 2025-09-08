/**
 * Hook personnalisé pour gérer la logique commune des modales de formulaire
 * Respecte le principe SRP - responsable uniquement de la logique des modales
 */

import { useForm, FieldValues, DefaultValues, SubmitHandler } from 'react-hook-form';
import { useCallback } from 'react';

interface UseModalFormOptions<T extends FieldValues> {
  defaultValues: DefaultValues<T>;
  onSave: (data: T) => void;
  onCancel: () => void;
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all';
}

export function useModalForm<T extends FieldValues>({
  defaultValues,
  onSave,
  onCancel,
  mode = 'onChange',
}: UseModalFormOptions<T>) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<T>({
    mode,
    defaultValues,
  });

  const handleSave: SubmitHandler<T> = useCallback(
    (data: T) => {
      onSave(data);
      reset();
    },
    [onSave, reset]
  );

  const handleCancel = useCallback(() => {
    reset();
    onCancel();
  }, [onCancel, reset]);

  const onSubmit = handleSubmit(handleSave);

  return {
    control,
    errors,
    isValid,
    onSubmit,
    handleCancel,
    reset,
  };
}
