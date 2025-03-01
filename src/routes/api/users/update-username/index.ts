import { RequestHandler } from '@builder.io/qwik-city';
import { supabase } from '~/lib/supabase';

export const onPost: RequestHandler = async (requestEvent) => {
  try {
    const { userId, username } = await requestEvent.parseBody();

    if (!userId || !username) {
      return requestEvent.json(
        { success: false, message: 'UserId y username son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el username ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (checkError) {
      return requestEvent.json(
        { success: false, message: 'Error al verificar disponibilidad del username' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return requestEvent.json(
        { success: false, message: 'Este nombre de usuario ya está en uso' },
        { status: 400 }
      );
    }

    // Actualizar el username
    const { error: updateError } = await supabase
      .from('users')
      .update({ username })
      .eq('id', userId);

    if (updateError) {
      return requestEvent.json(
        { success: false, message: 'Error al actualizar el nombre de usuario' },
        { status: 500 }
      );
    }

    return requestEvent.json({ success: true, message: 'Nombre de usuario actualizado exitosamente' });
  } catch (error) {
    return requestEvent.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}; 