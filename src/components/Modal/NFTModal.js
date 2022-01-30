import React, { useState, useEffect } from "react";
import Caver from 'caver-js';
import { Button, Modal, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { ToastsStore } from 'react-toasts';
import { KAL_ADDR, NFT_LIST, KAL_ABI } from '../../constant.js';

export default function SoulModal({ modal, close }) {
  const [list, setList] = useState([]);
  const [select, setSelect] = useState(-1);
  const [bal, setBal] = useState(0);

  useEffect(() => {
    if(modal) {
      (async() => {
        const { klaytn } = window;
        await klaytn.enable();
  
        const caver = new Caver(klaytn);
        const myContract = new caver.klay.Contract(
          KAL_ABI,
          KAL_ADDR
        );
  
        myContract.methods.dashboard(NFT_LIST[0].addr).call({
          from : klaytn.selectedAddress
        }, (_, result) => {
          const addList = result[0];
          const cntList = result[1];
          const resList = [];

          addList.forEach((addr, idx) => {
            if(cntList[idx] > 0) {
              NFT_LIST.forEach(nft => {
                if(nft.addr === addr) resList.push(nft);
              })
            }
          });

          setList(resList);
          setBal(result[5]);
          console.log(result[5])

          if(resList.length === 0) {
            ToastsStore.error('교환할 수 있는 NFT가 없습니다.');
            close();
          }
        });
      })();

    } else {
      setSelect(-1);
      setList([]);
    }
  }, [modal]);

  const itemStyle = (idx) => {
    if(idx === select) return '1px solid';
    return '';
  }

  const getNFT = async () => {
    const { klaytn } = window;
    await klaytn.enable();

    const caver = new Caver(klaytn);
    const myContract = new caver.klay.Contract(
      KAL_ABI,
      KAL_ADDR
    );
    
    try {
      myContract.methods.getNft(list[select].addr)
      .send({
          from: klaytn.selectedAddress,
          gas: 800000
      }, function(err, tx) {
        if(!err && tx) {
          ToastsStore.success('NFT를 획득했습니다!');
          close();
        } else {
          ToastsStore.error('다시 시도해주세요');
          close();
        }
      });
    } catch {
      ToastsStore.error('다시 시도해주세요');
      close();
    }
  }

  return (
    <Modal isOpen={modal} modalClassName="modal-black">
      <div className="modal-header">
        <p className="ml-3">
          { bal }

          <img
            alt="soul"
            className="img-fluid ml-1"
            width={16}
            src="/img/1.png"
          />
        </p>

        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={() => close()}
        >
          <i className="tim-icons icon-simple-remove" />
        </button>
      </div>

      <ModalBody>
        <Row className="mt-5 mb-5">
          {
            list.map((nft, idx) => (
              <Col 
                lg="4" 
                md="4" 
                key={idx}
                className="mb-3"
                onClick={() => setSelect(idx)}
                style={{ border: itemStyle(idx) }}
              >
                <img
                  alt="soul"
                  className="img-center img-fluid"
                  src={nft.imgUrl}
                />
              </Col>
            ))
          }
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={() => close()}>
          닫기
        </Button>

        <Button
          color="info"
          onClick={() => getNFT()}
          disabled={select < 0 && bal == 0}
        >
          빙의
        </Button>
      </ModalFooter>
    </Modal>
  );
}
