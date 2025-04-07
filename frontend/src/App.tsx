import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'

const exampleTexts = {
  somzz: `불면증 디지털치료기기 솜즈(Somzz)
본 제품은 만성불면증 치료의 목적으로 설계된 소프트웨어 의료기기로, 실제 임상진료 현장의 표준치료인 불면증인지행동치료법 (CBT-I; Cognitive Behavioral Therapy for Insomnia)의 프로토콜 (자극조절법, 수면제한법, 수면습관교육법, 이완요법 및 인지치료법)을 모바일용 어플리케이션에 체계적인 알고리즘을 순차적으로 적용하여 구현되었다. 인지행동치료는 사고와 행동을 조절함으로써 증상을 개선시키는 정신치료요법이다. 인지치료는 불면과 관련된 역기능적 신념을 교정하여 건강한 수면 습관을 기를 수 있게 하고, 행동치료는 자극조절요법, 수면제한요법, 이완요법을 통해 수면의 질이 향상되도록 한다. 이 내용을 바탕으로 불면증 환자들에게 교육, 실시간 피드백, 행동중재 및 푸시알림 메시지 등을 6~9주간 제공하여 수면효율을 증가시키고 결과적으로 환자의 불면증을 개선한다.`,
  nicojini: `니코틴 사용장애 디지털치료기기 닥터진 니코지니
본 제품은 니코틴 사용장애 환자의 니코틴 의존증상을 개선하기 위한 치료목적의 인지치료 소프트웨어입니다. 총 8주 동안 비약물치료인 동기강화훈련(Motivational Enhancement Therapy, MET) 및 인지행동치료(Cognitive Behavioral Therapy, CBT) 프로그램을 기반으로 인공지능 챗봇기술과 알고리즘 기술을 통해 모바일 애플리케이션으로 구현되었습니다. 해당 모바일 의료용 앱을 통해 병원 외래에 오신 니코틴 사용장애 환자에게 치료의 접근성을 높이고, 의료진에게 업무 효율성을 개선함으로써 비용·효과적이면서 혁신적인 치료적 개입방안을 제공하기 위해 개발되었습니다.
본 제품은 담배흡연에 의한 정신 및 행동장애 등과 같은 임상적 기준에 의해 니코틴 중독군으로 진단받은 니코틴 사용장애 환자에게 처방하여 사용하는 디지털치료기기(Digital Therapeutics, DTx)에 해당됩니다. 주된 내용은 동기강화훈련 및 인지행동치료 임상지침을 기반으로 인공지능 챗봇기술과 알고리즘 기술 등을 통해 모바일 애플리케이션으로 구현되어 있습니다. 특히, 인공지능 챗봇을 이용하여 환자와 대화를 통해 라포(rapport)를 형성하고, 이를 기반으로 교육 프로그램의 수행을 원활하게 진행할 수 있도록 유도하여 흡연량 및 갈망수준, 복약확인 등의 모니터링을 통해 금연실패를 예측하고 모니터링하여 실패율을 낮춤으로써, 환자의 금연치료 기간을 증대시켜 금연을 지속적으로 유지하도록 하는 것이 목적입니다.`,
  laparoscopy: `이번에 시행할 수술은 복강경 담낭절제술로, 최소침습 방식으로 진행됩니다. 수술 전날 자정부터 금식하셔야 하고, 항응고제를 복용 중이시라면 사전에 중단 여부를 판단해야 합니다. 간 기능 수치와 출혈 경향을 확인하기 위한 검사도 예정되어 있으니, 입원 당일 오전까지 병원에 도착해 주세요.`,
  diabetes: `현재 HbA1c 수치가 8.1%로, 목표 수치인 7%를 초과하고 있습니다. 혈당 변동성이 크기 때문에 인슐린 용량을 조정할 필요가 있습니다. 또한, 당뇨병성 신증 위험이 있으므로, 정기적인 미세알부민 검사를 병행하며 식이조절도 강화해야 합니다. 가능하면 운동을 하루 30분 이상 주 5회 이상 실천해 주세요.`,
  pneumonia: `영상 판독 결과, 좌측 하엽에 경미한 염증 소견이 확인되었고, 이로 인해 미열과 기침이 지속되고 있는 것으로 보입니다. 폐렴 가능성을 배제할 수 없어 경구용 광범위 항생제를 7일간 처방드리겠습니다. 복용 중 복통이나 설사 등 위장관 증상이 나타나면 즉시 내원해 주세요.`,
  hyperlipidemia: `이번 건강검진에서 총콜레스테롤과 LDL 수치가 모두 상승한 상태로 확인됐습니다. 고지혈증 위험군에 해당하며, 식이요법과 함께 스타틴 계열의 약물 복용이 권고됩니다. 간 기능 수치 확인을 위해 주기적인 혈액검사가 필요하고, 경우에 따라 약제 조정이 이뤄질 수 있습니다.`,
  mmr: `이번 예방접종은 생후 12개월 차에 맞는 MMR 백신입니다. 접종 후 일시적인 발열이나 국소 통증이 나타날 수 있으나 대부분 자연적으로 호전됩니다. 드물게 발진이나 경련 등이 동반될 수 있으므로, 39도 이상의 고열이 지속되면 응급실 방문을 권장합니다. 접종 후 최소 20분간 병원에서 대기해 주세요.`
}

const loadingMessages = [
  "의학 용어를 쉬운 말로 바꾸는 중...",
  "어려운 말을 찾아서 풀어쓰는 중...",
  "교수님 말투 OFF, 친절한 설명 모드 ON...",
  "의사 선생님이 친절하게 설명하는 중...",
  "복잡한 내용을 쉽게 풀어쓰는 중..."
]

function LoadingIndicator() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length)
      setCurrentMessageIndex(randomIndex)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <div className="text-indigo-600 font-medium">{loadingMessages[currentMessageIndex]}</div>
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 rounded-full animate-progress"></div>
      </div>
    </div>
  )
}

function App() {
  const [inputText, setInputText] = useState('')
  const [transformedText, setTransformedText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const MAX_CHARS = 1000

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setInputText(text)
    
    // 경고 메시지가 표시되어 있을 경우 지우기
    if (showAlert && text.length <= MAX_CHARS) {
      setShowAlert(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 글자수 체크
    if (inputText.length > MAX_CHARS) {
      setShowAlert(true)
      return
    }
    
    setIsLoading(true)
    setError('')
    console.log('API 요청 시작: 백엔드 API 호출')

    try {
      // 백엔드 API 호출
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: inputText })
      });
      
      console.log('API 응답 상태:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 오류 응답:', errorText);
        console.error('응답 상태:', response.status, response.statusText);
        throw new Error(`서버 응답이 올바르지 않습니다. 상태 코드: ${response.status}. 응답: ${errorText.substring(0, 150)}...`);
      }

      const data = await response.json();
      console.log('API 응답 성공');
      setTransformedText(data.result || '');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다'
      setError(`텍스트 변환 중 오류가 발생했습니다: ${errorMessage}`)
      console.error('상세 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (key: keyof typeof exampleTexts) => {
    setInputText(exampleTexts[key])
    setDropdownOpen(false)
  }
  
  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-4">
            Med Ease
          </h1>
          <p className="text-lg text-gray-600">
            복잡한 의학 정보를 누구나 이해하기 쉽게
          </p>
        </div>
        
        <div className="bg-white shadow-xl rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <div className="flex items-center text-gray-500 text-xs">
                    <svg className="w-4 h-4 text-gray-400 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>의학 용어를 쉽게 바꿔 드립니다</span>
                  </div>
                  <label htmlFor="input-text" className="sr-only">텍스트 입력</label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <span>예시</span>
                      <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => handleExampleClick('somzz')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            Somzz 설명
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExampleClick('nicojini')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            Dr.Jin Nicojini 설명
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExampleClick('laparoscopy')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            복강경 담낭절제술 안내
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExampleClick('diabetes')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            당뇨병 혈당 관리
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExampleClick('pneumonia')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            폐렴 항생제 치료
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExampleClick('hyperlipidemia')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            고지혈증 약물치료
                          </button>
                          <button
                            type="button"
                            onClick={() => handleExampleClick('mmr')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                          >
                            MMR 백신 접종
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <span className={`text-sm ${inputText.length > MAX_CHARS ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                    {inputText.length}/{MAX_CHARS}자
                  </span>
                </div>
              </div>
              
              <textarea
                id="input-text"
                rows={8}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 ${inputText.length > MAX_CHARS ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`}
                value={inputText}
                onChange={handleTextChange}
                placeholder="여기에 텍스트를 입력하세요..."
                disabled={isLoading}
              />
            </div>
            
            {showAlert && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-600">
                  <strong>내용이 너무 많습니다.</strong> 1,000자 이내로 입력해 주세요.
                </div>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
              disabled={isLoading || !inputText.trim() || inputText.length > MAX_CHARS}
            >
              {isLoading ? '변환 중...' : '변환하기'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="mt-6 flex justify-center">
              <LoadingIndicator />
            </div>
          )}

          {transformedText && !isLoading && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">변환 결과</h2>
              <div className="bg-gray-50 p-4 rounded-md prose max-w-none">
                <ReactMarkdown>{transformedText}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
