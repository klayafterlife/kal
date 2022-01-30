import React, { useState } from "react";
// import Caver from 'caver-js';
import { Button, Card, CardBody, Container, Row, Col } from "reactstrap";
import { ToastsContainer, ToastsStore, ToastsContainerPosition } from 'react-toasts';

import SoulModal from "components/Modal/SoulModal.js";
import NFTModal from "components/Modal/NFTModal.js";
import Footer from "components/Footer/Footer.js";
// import { KAL_ADDR, KAL_ABI } from '../../constant.js';

export default function Home() {
  const [soulModal, setSoulModal] = useState(false);
  const [nftModal, setNFTModal] = useState(false);

  React.useEffect(() => {
    document.body.classList.add("profile-page");

    const { klaytn } = window;
    if(klaytn) {
      klaytn.on('accountsChanged', () => {
        if(soulModal || nftModal) {
          setSoulModal(false);
          setNFTModal(false);  
        }
      });
      
      klaytn.on('networkChanged', () => {
        setSoulModal(false);
        setNFTModal(false);
      });
    }
  },[]);

  const open = (type) => {
    const { klaytn } = window;
    if (!klaytn || !klaytn.isKaikas) {
      errMsg('KAIKAS가 설치된 PC 브라우저에서만 가능합니다');
      return;
    }
    if(klaytn.networkVersion !== 8217) {
      errMsg('Cypress Main Network로 변경해주세요')
      return;
    }

    klaytn.enable().then(() => {
      if(type === 'soul') {
        setSoulModal(true);
      }
      if(type === 'nft') {
        setNFTModal(true);
      }
    });
  }

  // const support = async () => {
  //   const { klaytn } = window;
  //   if (!klaytn || !klaytn.isKaikas) {
  //     errMsg('KAIKAS가 설치된 PC 브라우저에서만 가능합니다');
  //     return;
  //   }
  //   // if(klaytn.networkVersion !== 8217) {
  //   //   errMsg('Cypress Main Network로 변경해주세요')
  //   //   return;
  //   // }

  //   await klaytn.enable();

  //   const caver = new Caver(klaytn);
  //   const myContract = new caver.klay.Contract(
  //     KAL_ABI,
  //     KAL_ADDR
  //   );
    
  //   try {
  //     myContract.methods.addSupport()
  //     .send({
  //       from: klaytn.selectedAddress,
  //       value: caver.utils.toPeb('0.05', 'KLAY'),
  //       gas: 800000
  //     }, function(err, tx) {
  //       if(!err && tx) {
  //         ToastsStore.success('후원자로 등록되었습니다!');
  //       } else {
  //         ToastsStore.error('다시 시도해주세요');
  //       }
  //     });
  //   } catch {
  //     ToastsStore.error('다시 시도해주세요');
  //   }
  // }

  const errMsg = (msg) => {
    ToastsStore.error(msg);
  }

  return (
    <>
      <div className="wrapper">
        <div className="page-header">
          <Container className="align-items-center">
            <Row>
              <Col lg="6" md="6">
                <h1 className="profile-title text-left">영혼 추출</h1>
                <h5 className="text-on-back">01</h5>
                <p className="profile-description">
                  모든 삼라만상에는 영혼이 깃들어있습니다.<br />
                  우리는 실험을 통해 일부 NFT에서 영혼을 분리하는 것에 성공했습니다.<br />
                  이제 우리는 더 많은 실험체를 통해 더 많은 데이터를 얻고자 합니다. 우리의 실험에 동참해주세요.
                </p>

                <Button
                  className="btn-simple mt-3"
                  color="success"
                  href="#pablo"
                  onClick={() => open('soul')}
                >
                  실험 참여
                </Button>
              </Col>
              <Col className="ml-auto mr-auto mt-5 pt-5" lg="4" md="6">
                <Card className="card-plain mt-5">
                  <CardBody>
                    <img
                      alt="soul"
                      className="img-center img-fluid rounded-circle"
                      src="/img/1.png"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        <div className="section">
          <Container>
            <Row className="justify-content-between">
              <Col md="6">
                <Row className="justify-content-between align-items-center mt-5 pt-5">
                  <img
                    alt="soul"
                    className="img-center img-fluid"
                    src="/img/2.png"
                  />
                </Row>
              </Col>
              <Col md="5">
                <h1 className="profile-title text-left">빙의</h1>
                <h5 className="text-on-back">02</h5>
                <p className="profile-description text-left">
                  우리는 영혼이 빠져나간 NFT를 보관합니다.<br />
                  영혼 소유자는 보관 중인 NFT 중 하나에 빙의할 수 있습니다.
                </p>
                <div className="btn-wrapper pt-3">
                  <Button
                    className="btn-simple"
                    color="info"
                    href="#pablo"
                    onClick={() => open('nft')}
                  >
                    들어가기
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* <section className="section">
          <Container>
            <Row>
              <Col md="6">
                <Card className="card-plain">
                  <CardHeader>
                    <h1 className="profile-title text-left">기부</h1>
                    <h5 className="text-on-back">03</h5>
                  </CardHeader>

                  <CardBody>
                    <p className="profile-description text-left">
                      우리의 연구 성과는 모두 무료로 제공됩니다.<br />
                      우리는 더 많은 실험을 준비하고 있고 실험에는 많은 비용과 시간이 필요합니다.<br />
                      우리가 더 많은 실험을 할 수 있게 도와주세요.
                    </p>

                    <div className="btn-wrapper pt-3">
                      <Button
                        className="btn-simple"
                        color="warning"
                        href="#pablo"
                        onClick={() => support()}
                      >
                        50 KLAY 기부
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col className="ml-auto" md="4">
                <div className="info info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-paper" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">기부금 사용처</h4>
                    <p>
                      연구소 유지비<br />
                      추가 실험 비용<br />
                      영혼 공급
                    </p>
                  </div>
                </div>
                <div className="info info-horizontal">
                  <div className="icon icon-primary">
                    <i className="tim-icons icon-notes" />
                  </div>
                  <div className="description">
                    <h4 className="info-title">추가 실험 목록</h4>
                    <p>
                      백귀야행<br />
                      후원자 혜택 1<br />
                      후원자 혜택 2
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section> */}

        {/* <div className="section">
          <Container>
            <Row>
              <Col lg="6" md="6">
                <h1 className="profile-title text-left">백귀야행</h1>
                <h5 className="text-on-back">03</h5>
                <p className="profile-description">
                  영혼이 된 귀신들의 축제.<br />
                  산과 호수 중 선택하여 참여할 수 있습니다.<br />
                  참여에는 하나의 영혼이 필요합니다.<br />
                  둘 중 더 시끄러운 곳에 저승사자가 나타납니다.<br />
                  살아남은 영혼은 2배로 커집니다.
                </p>
                <Button
                  className="btn mt-3 mr-2"
                  color="success"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  산
                </Button>
                <Button
                  className="btn mt-3"
                  color="info"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  호수
                </Button>
              </Col>
              <Col className="ml-auto mr-auto mt-5" lg="4" md="6">
                <Card className="card-plain">
                  <CardBody>
                    <img
                      alt="soul"
                      className="img-center img-fluid mt-5 pt-3"
                      src="/img/3.png"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div> */}

        <Footer />

        <SoulModal modal={soulModal} close={() => setSoulModal(false)} />
        <NFTModal modal={nftModal} close={() => setNFTModal(false)} />
        
        <ToastsContainer 
          store={ToastsStore} 
          position={ToastsContainerPosition.BOTTOM_CENTER} 
          lightBackground
        />
      </div>
    </>
  );
}
