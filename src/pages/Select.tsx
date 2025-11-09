
import { Icon } from '@/components/icons/Icon';
import { SurvivorPanel } from '@/components/common/SurvivorPanel';
import SelectionFooter from '@/components/select/SelectionFooter';

export default function Select() {
    const avatarUrl = 'https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj';

        const participants = [
            { id: '1', name: '불친절한쉘시고기', platform: 'chzzk' as const },
            { id: '2', name: '삼광', platform: 'soop' as const },
            { id: '3', name: '불친절한쉘시고기', platform: 'youtube' as const },
            { id: '4', name: '대상 혁', platform: 'chzzk' as const },
            { id: '5', name: '대상 혁', platform: 'soop' as const },
            { id: '6', name: '가너다라마사아자차카타파하', platform: 'youtube' as const },
            { id: '7', name: '가니다', platform: 'soop' as const },
            { id: '8', name: '쀼뀨아', platform: 'soop' as const },
            { id: '9', name: '치지지지', platform: 'soop' as const },
            { id: '10', name: '수수수수수', platform: 'soop' as const },
            { id: '11', name: '유유유유유유마그네릭', platform: 'soop' as const },
        ];

        return (

        <div className="flex h-full w-full pr-10 pl-10 pt-3 pb-3 gap-6">
            {/* 1. 좌측 영역 */}
            <div className="flex flex-1 flex-col gap-3">
                {/* 1-1. 상단 */}
                <div className="h-[165px] w-full border-2 border-red-500 flex items-center justify-between px-8">
                    <div className="text-red-500 text-[105px] font-black leading-none text-left whitespace-nowrap" style={{ letterSpacing: '115px' ,marginRight: '-115px'}}>
                        첫번째
                    </div>

                    <div className="relative h-[135px] w-[135px] rounded-full ring-4 ring-red-500 overflow-hidden">
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="text-white text-[105px] font-black leading-none text-right whitespace-nowrap" style={{ letterSpacing: '115px', marginRight: '-115px' }}>
                        라운드
                    </div>
                </div>

                {/* 1-2. 중간 */}
                <div className="flex-1 w-full border-2 border-blue-500">
                </div>

                {/* 1-3. 하단 */}
                <SelectionFooter />
            </div>

            {/* 2. 우측 영역 */}
            <div className="flex flex-col w-[350px] gap-3 min-h-0">
                {/* 2-1. 상단 */}
                <SurvivorPanel survivorCount={156} participants={participants} />

                {/* 2-2. 하단 */}
                <div className="flex-1 w-full border-2 flex border-purple-500 justify-center items-center text-white text-2xl font-black">
                    CAM / CHAT BOX AREA
                </div>
            </div>
        </div>
    );
}
