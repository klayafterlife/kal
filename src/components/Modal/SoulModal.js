import React, { useState, useEffect } from "react";
import Caver from 'caver-js';
import { Button, Modal, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { ToastsStore } from 'react-toasts';
import { KAL_ADDR, NFT_LIST, KAL_ABI, NFT_ABI } from '../../constant.js';

export default function SoulModal({ modal, close }) {
  const [selectedTab, setSelectedTab] = useState(-1);
  const [selectedId, setSelectedId] = useState(-1);
  const [idList, setIdList] = useState([]);
  const [isApprove, setIsApprove] = useState(false);
  const [bal, setBal] = useState(0);

  useEffect(() => {
    if(modal) {
      selectTab(0);
    } else {
      selectTab(-1);
    }
  }, [modal]);
  

  const tabClass = (idx) => {
    const defaultClass = 'btn-simple btn-sm';
    if(selectedTab === idx) return defaultClass + ' btn-neutral';
    return defaultClass;
  }

  const selectTab = async (idx) => {
    if(selectedTab === idx) return;

    setSelectedId(-1);
    setIsApprove(false);
    setIdList([]);

    if(idx === -1) return setSelectedTab(idx);

    const { klaytn } = window;
    await klaytn.enable();

    const caver = new Caver(klaytn);
    const myContract = new caver.klay.Contract(
      KAL_ABI,
      KAL_ADDR
    );

    myContract.methods.dashboard(NFT_LIST[idx].addr).call({
      from : klaytn.selectedAddress
    }, (_, result) => {
      setIsApprove(result[2]);
      setIdList(result[3]);
      setBal(result[5]);
    });

    setSelectedTab(idx);
  }

  const itemStyle = (id) => {
    if(id === selectedId) return '1px solid';
    return '';
  }

  const approval = async () => {
    const { klaytn } = window;
    await klaytn.enable();

    const caver = new Caver(klaytn);
    const myContract = new caver.klay.Contract(
      NFT_ABI,
      NFT_LIST[selectedTab].addr
    );

    try {
      myContract.methods.setApprovalForAll(KAL_ADDR, true)
      .send({
          from: klaytn.selectedAddress,
          gas: 800000
      }, function(err, tx) {
        if(!err && tx) {
          ToastsStore.info('승인되었습니다.');
          setIsApprove(true);
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

  const getSoul = async () => {
    const { klaytn } = window;
    await klaytn.enable();

    const caver = new Caver(klaytn);
    const myContract = new caver.klay.Contract(
      KAL_ABI,
      KAL_ADDR
    );

    try {
      myContract.methods.getSoul(NFT_LIST[selectedTab].addr, selectedId)
      .send({
          from: klaytn.selectedAddress,
          gas: 800000
      }, function(err, tx) {
        if(!err && tx) {
          ToastsStore.success('영혼을 획득했습니다!');
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

      <ModalBody className="mb-5">
        {
          NFT_LIST.map((nft, idx) => (
            <Button
              key={idx}
              className={tabClass(idx)}
              onClick={() => selectTab(idx)}
            >
              {nft.symbol}
            </Button>
          ))
        }

        <Row className="mt-5">
          { selectedTab > -1 && isApprove &&
            idList.map(id => (
              <Col 
                lg="4"
                md="4"
                key={id}
                onClick={() => setSelectedId(id)}
                style={{ border: itemStyle(id) }}
              >
                <img
                  alt="soul"
                  className="img-center img-fluid"
                  src={NFT_LIST[selectedTab].imgUrl}
                />
                <p className="text-center">{id}</p>
              </Col>
            ))
          }

          { selectedTab > -1 && isApprove && idList.length === 0 &&
            <Col lg="12" md="12" className="ml-1 mr-3">
              <p>
                NFT가 존재하지 않습니다.
              </p>
            </Col>
          }

          { selectedTab > -1 && !isApprove &&
            <Row className="ml-1 mr-3">
              <Col lg="12" md="12">
                <p>
                  {
                    idList.length === 0 ? 
                    'NFT가 존재하지 않습니다.' : 
                    '영혼 추출을 위해서는 해당 NFT 전송 권한에 대한 승인 필요합니다.' 
                  }
                </p>
              </Col>

              {
                idList.length > 0 &&
                <Col lg="12" md="12">
                  <Button
                    className="btn-simple btn-sm btn-success float-right mt-3 mr-3"
                    onClick={() => approval()}
                  >
                    승인하기
                  </Button>
                </Col>
              }
            </Row>
          }
        </Row>
      </ModalBody>

      <ModalFooter>
        <Button onClick={() => close()}>
          닫기
        </Button>

        <Button
          color="info"
          onClick={() => getSoul()}
          disabled={idList.length === 0 || !isApprove || selectedId < 0}
        >
          추출
        </Button>
      </ModalFooter>
    </Modal>
  );
}
