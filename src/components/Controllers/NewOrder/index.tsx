import React, {useRef} from 'react';
import {
  BottomSheetView,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import {Background} from './styles';
import {Button} from '../../Controllers/Button';
import {OrderForm} from '../../Forms/OrderForm';

export function NewOrder() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  function handleSnapPress() {
    bottomSheetRef.current?.present();
  }

  return (
    <>
      <Button title="Novo chamado" onPress={handleSnapPress} />

      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={['88%', '50%', '100%']}
          style={{padding: 24}}
          enablePanDownToClose={true}
          backdropComponent={() => <Background />}>
          <BottomSheetView>
            <OrderForm />
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </>
  );
}
