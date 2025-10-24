import { useState, useEffect, useRef } from 'react';
import './PolyChatSamplePage.css';
import { ChzzkAdapter, SoopAdapter, YouTubeAdapter, ChatMessage, PolyChat, BroadcasterInfo, IChatAdapter } from 'polychat-bridge';

type Platform = 'chzzk' | 'soop' | 'youtube';

interface PlatformConfig {
    clientId: string;
    clientSecret?: string;
    redirectUri?: string;
    pollingIntervalSeconds?: number;
}

interface AdapterState {
    adapter: ChzzkAdapter | SoopAdapter | YouTubeAdapter;
    status: 'disconnected' | 'initialized' | 'authenticated' | 'connected';
    error: string;
    config: PlatformConfig;
    broadcasterInfo?: BroadcasterInfo | null;
}

type MessageType = 'chat' | 'system';

interface DisplayMessage {
    platform: Platform;
    type: MessageType;
    nickname: string;
    content: string;
    timestamp: Date;
    chat_id?: string;
}

function PolyChatSamplePage() {
    const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(new Set());
    const [adapters, setAdapters] = useState<Map<Platform, AdapterState>>(new Map());
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [isConfigured, setIsConfigured] = useState(false);
    const [polyChat] = useState<PolyChat>(() => new PolyChat());
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isTestMode, setIsTestMode] = useState(false);
    const testModeIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        // Use scrollIntoView for more reliable scrolling
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Test mode: Simulate incoming messages
    useEffect(() => {
        if (isTestMode) {
            const platforms: Platform[] = ['chzzk', 'soop', 'youtube'];
            const usernames = ['테스트유저1', '테스트유저2', '테스트유저3', '뷰어123', '시청자A', '팬B'];
            const messageContents = [
                '안녕하세요!',
                'ㅋㅋㅋㅋㅋㅋ',
                '오늘 방송 재밌네요',
                '구독했습니다!',
                '이거 어떻게 하는 거예요?',
                '대박 ㄷㄷㄷ',
                '감사합니다',
                '좋아요 눌렀어요',
                '첫 방문이에요',
                '방송 화이팅!',
            ];

            const generateRandomMessage = () => {
                const platform = platforms[Math.floor(Math.random() * platforms.length)];
                const username = usernames[Math.floor(Math.random() * usernames.length)];
                const content = messageContents[Math.floor(Math.random() * messageContents.length)];

                setMessages((prev) => [...prev, {
                    platform,
                    type: 'chat',
                    nickname: username,
                    content,
                    timestamp: new Date(),
                    chat_id: 'test-' + Math.random().toString(36).substring(7),
                }]);
            };

            // Generate messages at random intervals (500ms ~ 2000ms)
            const scheduleNextMessage = () => {
                const delay = Math.random() * 500;
                testModeIntervalRef.current = setTimeout(() => {
                    generateRandomMessage();
                    scheduleNextMessage();
                }, delay);
            };

            scheduleNextMessage();

            return () => {
                if (testModeIntervalRef.current) {
                    clearTimeout(testModeIntervalRef.current);
                    testModeIntervalRef.current = null;
                }
            };
        }
    }, [isTestMode]);

    // Set up PolyChat event listeners
    useEffect(() => {
        const handleMessage = ({ platform, message }: { platform: string; message: ChatMessage }) => {
            console.log(`[${platform.toUpperCase()}] Message received:`, message);
            const isSystemMessage = message.nickname === 'SYSTEM';
            setMessages((prev) => [...prev, {
                platform: platform as Platform,
                type: isSystemMessage ? 'system' : 'chat',
                nickname: message.nickname,
                content: message.content,
                timestamp: message.timestamp,
                chat_id: message.chat_id,
            }]);
        };

        const handleError = ({ platform, error }: { platform: string; error: Error }) => {
            console.log(`[${platform.toUpperCase()}] Error:`, error);
            updateAdapterState(platform as Platform, { error: error.message });
            addSystemMessage(platform as Platform, `❌ 오류 발생: ${error.message}`);
        };

        const handleConnected = ({ platform }: { platform: string }) => {
            console.log(`[${platform.toUpperCase()}] Connected`);
            updateAdapterState(platform as Platform, { status: 'connected' });
            addSystemMessage(platform as Platform, '✅ 채팅 서버에 연결되었습니다');
        };

        const handleDisconnected = ({ platform }: { platform: string }) => {
            console.log(`[${platform.toUpperCase()}] Disconnected`);
            updateAdapterState(platform as Platform, { status: 'disconnected' });
            addSystemMessage(platform as Platform, '⚠️ 채팅 서버 연결이 해제되었습니다');
        };

        const handleAuth = ({ platform, broadcasterInfo }: { platform: string; broadcasterInfo: BroadcasterInfo | null }) => {
            console.log(`[${platform.toUpperCase()}] Auth:`, broadcasterInfo);
            if (broadcasterInfo) {
                updateAdapterState(platform as Platform, {
                    status: 'authenticated',
                    broadcasterInfo: broadcasterInfo
                });
                addSystemMessage(platform as Platform, `🔑 인증 성공: ${broadcasterInfo.nickname}`);
            } else {
                updateAdapterState(platform as Platform, {
                    status: 'disconnected',
                    broadcasterInfo: null
                });
                addSystemMessage(platform as Platform, '❌ 인증에 실패했습니다');
            }
        };

        const handleInitialized = ({ platform }: { platform: string }) => {
            console.log(`[${platform.toUpperCase()}] Initialized`);
            addSystemMessage(platform as Platform, '🚀 초기화가 완료되었습니다');
        };

        polyChat.on('message', handleMessage);
        polyChat.on('error', handleError);
        polyChat.on('connected', handleConnected);
        polyChat.on('disconnected', handleDisconnected);
        polyChat.on('auth', handleAuth);
        polyChat.on('initialized', handleInitialized);

        return () => {
            polyChat.off('message', handleMessage);
            polyChat.off('error', handleError);
            polyChat.off('connected', handleConnected);
            polyChat.off('disconnected', handleDisconnected);
            polyChat.off('auth', handleAuth);
            polyChat.off('initialized', handleInitialized);
        };
    }, [polyChat]);

    const addSystemMessage = (platform: Platform, content: string) => {
        setMessages((prev) => [...prev, {
            platform,
            type: 'system',
            nickname: 'SYSTEM',
            content,
            timestamp: new Date(),
        }]);
    };

    // Platform configurations
    const [configs, setConfigs] = useState<Record<Platform, PlatformConfig>>({
        chzzk: {
            clientId: import.meta.env.VITE_CHZZK_CLIENT_ID || '',
            clientSecret: import.meta.env.VITE_CHZZK_CLIENT_SECRET || '',
            redirectUri: 'http://localhost:3000/callback',
        },
        soop: {
            clientId: import.meta.env.VITE_SOOP_CLIENT_ID || '',
            clientSecret: import.meta.env.VITE_SOOP_CLIENT_SECRET || '',
        },
        youtube: {
            clientId: import.meta.env.VITE_YOUTUBE_CLIENT_ID || '',
            redirectUri: 'http://localhost:3000/callback',
            pollingIntervalSeconds: 5, // 기본값 5초
        },
    });

    const togglePlatform = (platform: Platform) => {
        setSelectedPlatforms((prev) => {
            const next = new Set(prev);
            if (next.has(platform)) {
                next.delete(platform);
            } else {
                next.add(platform);
            }
            return next;
        });
    };

    const updateConfig = (platform: Platform, key: keyof PlatformConfig, value: string | number) => {
        setConfigs((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform],
                [key]: key === 'pollingIntervalSeconds' ? Number(value) : value,
            },
        }));
    };

    const handleConfigure = () => {
        if (selectedPlatforms.size === 0) {
            alert('최소 하나의 플랫폼을 선택해주세요.');
            return;
        }
        setIsConfigured(true);
    };

    const handleInit = async (platform: Platform) => {
        const config = configs[platform];

        try {
            let adapter: ChzzkAdapter | SoopAdapter | YouTubeAdapter;

            if (platform === 'chzzk') {
                adapter = new ChzzkAdapter();
            } else if (platform === 'soop') {
                adapter = new SoopAdapter();
            } else {
                adapter = new YouTubeAdapter();
            }

            // Register adapter with PolyChat
            polyChat.registerAdapter(adapter as unknown as IChatAdapter);

            // Initialize - init now handles code internally
            if (platform === 'chzzk') {
                // CHZZK requires redirectUri
                if (!config.redirectUri) {
                    throw new Error('redirectUri is required for CHZZK');
                }
                await (adapter as ChzzkAdapter).init({
                    clientId: config.clientId,
                    clientSecret: config.clientSecret || '',
                    redirectUri: config.redirectUri,
                    apiBaseUrl: '/api/chzzk',
                });
            } else if (platform === 'youtube') {
                // YouTube requires redirectUri
                if (!config.redirectUri) {
                    throw new Error('redirectUri is required for YouTube');
                }
                await (adapter as YouTubeAdapter).init({
                    clientId: config.clientId,
                    redirectUri: config.redirectUri,
                    pollingIntervalSeconds: config.pollingIntervalSeconds,
                });
            } else {
                // SOOP doesn't require redirectUri
                await (adapter as SoopAdapter).init({
                    clientId: config.clientId,
                    clientSecret: config.clientSecret || '',
                });
            }

            setAdapters((prev) => {
                const next = new Map(prev);
                next.set(platform, {
                    adapter,
                    status: 'initialized',
                    error: '',
                    config: { ...config },
                });
                return next;
            });
        } catch (err: any) {
            updateAdapterState(platform, { error: err.message });
        }
    };

    const handleAuthenticate = async (platform: Platform) => {
        const adapterState = adapters.get(platform);
        if (!adapterState) return;

        try {
            const config = configs[platform];

            if (platform === 'chzzk') {
                await (adapterState.adapter as ChzzkAdapter).authenticate({
                    clientId: config.clientId,
                    clientSecret: config.clientSecret || '',
                    redirectUri: config.redirectUri || '',
                    state: '', // adapter internal state will be used
                });
            } else if (platform === 'soop') {
                await (adapterState.adapter as SoopAdapter).authenticate({
                    clientId: config.clientId,
                    clientSecret: config.clientSecret || '',
                });
            } else if (platform === 'youtube') {
                await (adapterState.adapter as YouTubeAdapter).authenticate({});
            }

            updateAdapterState(platform, { status: 'authenticated', error: '' });
        } catch (err: any) {
            updateAdapterState(platform, { error: err.message });
        }
    };

    const handleConnect = async (platform: Platform) => {
        const adapterState = adapters.get(platform);
        if (!adapterState) return;

        try {
            await adapterState.adapter.connect();
            updateAdapterState(platform, { error: '' });
        } catch (err: any) {
            updateAdapterState(platform, { error: err.message });
        }
    };

    const handleDisconnect = async (platform: Platform) => {
        const adapterState = adapters.get(platform);
        if (!adapterState) return;

        try {
            await adapterState.adapter.disconnect();
            updateAdapterState(platform, { status: 'disconnected', error: '' });
        } catch (err: any) {
            updateAdapterState(platform, { error: err.message });
        }
    };

    const updateAdapterState = (platform: Platform, updates: Partial<AdapterState>) => {
        setAdapters((prev) => {
            const next = new Map(prev);
            const current = next.get(platform);
            if (current) {
                next.set(platform, { ...current, ...updates });
            }
            return next;
        });
    };

    const handleReset = () => {
        adapters.forEach((state) => {
            state.adapter.disconnect().catch(() => {});
        });
        setAdapters(new Map());
        setMessages([]);
        setIsConfigured(false);
    };

    const getPlatformName = (platform: Platform) => {
        switch (platform) {
            case 'chzzk': return 'CHZZK';
            case 'soop': return 'SOOP';
            case 'youtube': return 'YouTube';
        }
    };

    const getPlatformColor = (platform: Platform) => {
        switch (platform) {
            case 'chzzk': return '#00e7a0';
            case 'soop': return '#ff6b00';
            case 'youtube': return '#ff0000';
        }
    };

    if (!isConfigured) {
        return (
            <div className="app">
                <header className="app-header">
                    <h1>PolyChat</h1>
                    <p>Multi-Platform Chat Bridge</p>
                </header>

                <div className="configuration-container">
                    <div className="config-section">
                        <h2>플랫폼 선택</h2>
                        <div className="platform-checkboxes">
                            {(['chzzk', 'soop', 'youtube'] as Platform[]).map((platform) => (
                                <label key={platform} className={`platform-checkbox ${selectedPlatforms.has(platform) ? 'selected' : ''}`}>
                                    <input
                                        type="checkbox"
                                        checked={selectedPlatforms.has(platform)}
                                        onChange={() => togglePlatform(platform)}
                                    />
                                    <span className="checkbox-label">{getPlatformName(platform)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {selectedPlatforms.size > 0 && (
                        <>
                            {Array.from(selectedPlatforms).map((platform) => (
                                <div key={platform} className="config-section">
                                    <h3>{getPlatformName(platform)} 설정</h3>
                                    <div className="config-form">
                                        <div className="form-field">
                                            <label>Client ID</label>
                                            <input
                                                type="text"
                                                value={configs[platform].clientId}
                                                onChange={(e) => updateConfig(platform, 'clientId', e.target.value)}
                                                placeholder="Client ID 입력"
                                            />
                                        </div>
                                        {(platform === 'chzzk' || platform === 'soop') && (
                                            <div className="form-field">
                                                <label>Client Secret</label>
                                                <input
                                                    type="password"
                                                    value={configs[platform].clientSecret}
                                                    onChange={(e) => updateConfig(platform, 'clientSecret', e.target.value)}
                                                    placeholder="Client Secret 입력"
                                                />
                                            </div>
                                        )}
                                        {(platform === 'chzzk' || platform === 'youtube') && (
                                            <div className="form-field">
                                                <label>Redirect URI</label>
                                                <input
                                                    type="text"
                                                    value={configs[platform].redirectUri || ''}
                                                    onChange={(e) => updateConfig(platform, 'redirectUri', e.target.value)}
                                                    placeholder="Redirect URI 입력"
                                                />
                                            </div>
                                        )}
                                        {platform === 'youtube' && (
                                            <div className="form-field">
                                                <label>Polling 간격 (초)</label>
                                                <select
                                                    value={configs[platform].pollingIntervalSeconds || 5}
                                                    onChange={(e) => updateConfig(platform, 'pollingIntervalSeconds', e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem 1rem',
                                                        background: '#0f0f0f',
                                                        border: '1px solid #1a1a1a',
                                                        color: '#ffffff',
                                                        fontSize: '0.9375rem',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seconds) => (
                                                        <option key={seconds} value={seconds}>
                                                            {seconds}초
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button className="btn-primary" onClick={handleConfigure}>
                                다음
                            </button>
                        </>
                    )}
                </div>

                <footer className="app-footer">
                    <p>Powered by <strong>PolyChat</strong></p>
                </footer>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>PolyChat</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        className={`btn-reset ${isTestMode ? 'btn-disconnect' : ''}`}
                        onClick={() => setIsTestMode(!isTestMode)}
                    >
                        {isTestMode ? '테스트 중지' : '테스트 모드'}
                    </button>
                    <button className="btn-reset" onClick={handleReset}>
                        재설정
                    </button>
                </div>
            </header>

            <div className="main-container">
                {/* Control Panel */}
                <div className="control-panel">
                    {Array.from(selectedPlatforms).map((platform) => {
                        const state = adapters.get(platform);
                        const status = state?.status || 'disconnected';
                        const error = state?.error || '';

                        return (
                            <div key={platform} className="platform-control">
                                <div className="platform-control-header">
                                    <h3 style={{ color: getPlatformColor(platform) }}>{getPlatformName(platform)}</h3>
                                    <span className={`status-indicator status-${status}`}>
                    {status === 'connected' && '● 연결됨'}
                                        {status === 'authenticated' && '● 인증됨'}
                                        {status === 'initialized' && '● 초기화됨'}
                                        {status === 'disconnected' && '○ 연결 안됨'}
                  </span>
                                </div>

                                {state?.broadcasterInfo && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem',
                                        background: '#1a1a1a',
                                        borderRadius: '0.5rem',
                                        marginBottom: '0.75rem',
                                    }}>
                                        <img
                                            src={state.broadcasterInfo.profileImageUrl}
                                            alt={state.broadcasterInfo.nickname}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                color: '#ffffff',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                marginBottom: '0.125rem',
                                            }}>
                                                {state.broadcasterInfo.nickname}
                                            </div>
                                            <div style={{
                                                color: '#888888',
                                                fontSize: '0.75rem',
                                            }}>
                                                방송인
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="error-message">⚠ {error}</div>
                                )}

                                <div className="platform-controls">
                                    {status === 'disconnected' && (
                                        <button
                                            className="btn-control"
                                            onClick={() => handleInit(platform)}
                                        >
                                            초기화
                                        </button>
                                    )}

                                    {status === 'initialized' && (
                                        <button
                                            className="btn-control"
                                            onClick={() => handleAuthenticate(platform)}
                                        >
                                            인증
                                        </button>
                                    )}

                                    {status === 'authenticated' && (
                                        <button
                                            className="btn-control btn-connect"
                                            onClick={() => handleConnect(platform)}
                                        >
                                            연결
                                        </button>
                                    )}

                                    {status === 'connected' && (
                                        <button
                                            className="btn-control btn-disconnect"
                                            onClick={() => handleDisconnect(platform)}
                                        >
                                            연결 해제
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Chat Display */}
                <div className="chat-panel">
                    <div className="chat-header">
                        <h2>통합 채팅</h2>
                        <span className="message-count">{messages.length} 메시지</span>
                    </div>

                    <div className="chat-messages" ref={chatMessagesRef}>
                        {messages.length === 0 ? (
                            <div className="empty-state">
                                채팅 메시지가 없습니다
                            </div>
                        ) : (
                            <>
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`chat-message ${msg.type === 'system' ? 'system-message' : ''}`}>
                    <span
                        className="platform-badge"
                        style={{ backgroundColor: getPlatformColor(msg.platform) }}
                    >
                      {getPlatformName(msg.platform)}
                    </span>
                                        <div className="message-body">
                                            <div className="message-meta">
                        <span className={`message-author ${msg.type === 'system' ? 'system-author' : ''}`}>
                          {msg.nickname}
                        </span>
                                                <span className="message-time">{msg.timestamp.toLocaleTimeString()}</span>
                                            </div>
                                            <div className={`message-text ${msg.type === 'system' ? 'system-text' : ''}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <footer className="app-footer">
                <p>Powered by <strong>PolyChat</strong></p>
            </footer>
        </div>
    );
}

export default PolyChatSamplePage;
