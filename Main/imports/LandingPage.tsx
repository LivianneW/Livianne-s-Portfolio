import svgPaths from "./svg-m0xd7eay53";
import clsx from "clsx";
import imgImage12 from "figma:asset/747c911889a81478136b20fad857c47b7b3a7c4f.png";
import imgBlackWhiteModernSimpleCreativeStudioHugeLogo12 from "figma:asset/1350546fa4be865b93dae47a95c24bf8426eed24.png";
import imgBlackWhiteModernSimpleCreativeStudioHugeLogo21 from "figma:asset/287db8fe7084b4c159206f0d60275f7d90a5c9e9.png";
import imgImage10 from "figma:asset/1554319f41a6a7d96f050a7b49a859c2538ccf74.png";
import imgIpad1 from "figma:asset/9aeeacd636a12e0d10e0b7420e4d5fc4ad5c3601.png";
type LandingPageHelperProps = {
  additionalClassNames?: string;
};

function LandingPageHelper({ additionalClassNames = "" }: LandingPageHelperProps) {
  return (
    <div className={clsx("absolute h-0 w-[346.006px]", additionalClassNames)}>
      <div className="absolute inset-[-1px_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 346.006 1">
          <line id="Line 4" stroke="var(--stroke-0, #F6C5B9)" strokeOpacity="0.25" x2="346.006" y1="0.5" y2="0.5" />
        </svg>
      </div>
    </div>
  );
}
type Text1Props = {
  text: string;
  additionalClassNames?: string;
};

function Text1({ text, additionalClassNames = "" }: Text1Props) {
  return (
    <div className={clsx("[grid-area:1_/_1] bg-[rgba(239,214,208,0.5)] content-stretch flex h-[25px] items-center justify-center overflow-clip px-[24px] py-[4px] relative rounded-[10px] w-[95px]", additionalClassNames)}>
      <p className="font-['Larsseit:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#585858] text-[12px] text-nowrap">{text}</p>
    </div>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="absolute bg-[rgba(88,88,88,0.5)] h-[19px] left-[296px] overflow-clip rounded-[21px] top-[9px] w-[39px]">
      <p className="absolute font-['Larsseit:Medium',sans-serif] h-[9px] leading-[99.995%] left-[10px] not-italic text-[12px] text-white top-[4.5px] w-[7px]">{text}</p>
      <div className="absolute flex inset-[21.05%_28.21%_26.32%_51.28%] items-center justify-center">
        <div className="flex-none h-[10px] rotate-[180deg] scale-y-[-100%] w-[8px]">
          <div className="relative size-full" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 10">
              <path d={svgPaths.p596ca00} fill="var(--fill-0, white)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function WelcomeBanner() {
  return (
    <div className="absolute h-[160.488px] left-[8px] top-[124px] w-[377.814px]" data-name="WELCOME BANNER">
      <div className="absolute inset-[-0.33%_-0.6%_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 380.076 161.02">
          <g id="WELCOME BANNER">
            <g filter="url(#filter0_gn_1_314)" id="Rectangle 17">
              <rect fill="var(--fill-0, #BFD999)" height="117" rx="15" width="346" x="17.2925" y="21.8566" />
            </g>
            <g filter="url(#filter1_gn_1_314)" id="Vector 15">
              <path d={svgPaths.p19595700} stroke="var(--stroke-0, #FAF9F5)" strokeLinecap="round" strokeWidth="12" />
            </g>
            <g filter="url(#filter2_gn_1_314)" id="Vector 19">
              <path d={svgPaths.p25e50c80} stroke="var(--stroke-0, #70B074)" strokeLinecap="round" strokeWidth="12" />
            </g>
            <g filter="url(#filter3_gn_1_314)" id="Vector 14">
              <path d={svgPaths.p1c92d000} stroke="var(--stroke-0, #FAF9F5)" strokeLinecap="round" strokeWidth="12" />
            </g>
            <g filter="url(#filter4_gn_1_314)" id="Vector 17">
              <path d={svgPaths.p3d46b280} stroke="var(--stroke-0, #70B074)" strokeLinecap="round" strokeWidth="12" />
            </g>
            <g filter="url(#filter5_gn_1_314)" id="Vector 18">
              <path d={svgPaths.p2d994280} stroke="var(--stroke-0, #FAFAF6)" strokeLinecap="round" strokeWidth="12" />
            </g>
            <g filter="url(#filter6_gn_1_314)" id="Vector 16">
              <path d={svgPaths.p247b3980} stroke="var(--stroke-0, #70B074)" strokeLinecap="round" strokeWidth="12" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="120.2" id="filter0_gn_1_314" width="349.2" x="15.6925" y="20.2566">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.030120480805635452 0.030120480805635452" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="3.2000000476837158" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="74.9936" id="filter1_gn_1_314" width="86.8306" x="167.68" y="41.5425">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.039215687662363052 0.039215687662363052" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="74.9936" id="filter2_gn_1_314" width="86.8306" x="161.825" y="37.4193">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.039215687662363052 0.039215687662363052" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="137.802" id="filter3_gn_1_314" width="189.849" x="7.50588" y="11.1154">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.039215687662363052 0.039215687662363052" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="145.568" id="filter4_gn_1_314" width="191.504" x="0.564364" y="9.70053">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.039215687662363052 0.039215687662363052" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="107.579" id="filter5_gn_1_314" width="128.281" x="251.795" y="1.90791">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.039215687662363052 0.039215687662363052" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="110.328" id="filter6_gn_1_314" width="127.536" x="246.687" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.039215687662363052 0.039215687662363052" numOctaves="3" seed="2081" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="4" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_314">
                <feMergeNode in="displacedImage" />
              </feMerge>
              <feTurbulence baseFrequency="10 10" numOctaves="3" result="noise" seed="7421" stitchTiles="stitch" type="fractalNoise" />
              <feColorMatrix in="noise" result="alphaNoise" type="luminanceToAlpha" />
              <feComponentTransfer in="alphaNoise" result="coloredNoise1">
                <feFuncA type="discrete" />
              </feComponentTransfer>
              <feComposite in="coloredNoise1" in2="effect1_texture_1_314" operator="in" result="noise1Clipped" />
              <feFlood floodColor="rgba(255, 255, 255, 0.25)" result="color1Flood" />
              <feComposite in="color1Flood" in2="noise1Clipped" operator="in" result="color1" />
              <feMerge result="effect2_noise_1_314">
                <feMergeNode in="effect1_texture_1_314" />
                <feMergeNode in="color1" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Introduction() {
  return (
    <div className="absolute contents left-[24px] not-italic top-[304px]" data-name="Introduction">
      <p className="absolute font-['Larsseit:Medium',sans-serif] leading-[normal] left-[24px] text-[#1c1c1c] text-[28px] text-nowrap top-[304px]">{`Hello! I’m Livianne `}</p>
      <p className="absolute font-['Larsseit:Light',sans-serif] leading-[1.3] left-[24px] text-[#1c1c1c] text-[14px] top-[360px] w-[304px]">
        <span className="not-italic text-[#585858]">currently studying</span> <span className="font-['Larsseit:Medium',sans-serif] not-italic">cognitive science</span> <span className="not-italic text-[#585858]">w/ a specialization</span>
        <span className="not-italic text-[#585858]"> </span>
        <span className="not-italic text-[#585858]">in</span> <span className="font-['Larsseit:Medium',sans-serif] not-italic">design and interaction</span> <span className="not-italic text-[#585858]">at</span> <span className="font-['Larsseit:Medium',sans-serif] not-italic">UCSD</span>
      </p>
      <p className="absolute font-['Larsseit:Medium',sans-serif] leading-[1.3] left-[98px] text-[#585858] text-[14px] text-center text-nowrap top-[332px] translate-x-[-50%]">Product Design Student</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[21px] left-[285px] top-[1721px] w-[85px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85 21">
        <g id="Frame 15">
          <path d={svgPaths.p3388f800} fill="var(--fill-0, #D3A0A0)" id="Vector" />
          <g id="business-user-curriculum">
            <path clipRule="evenodd" d={svgPaths.p2a9fb380} fill="var(--fill-0, #D3A0A0)" fillRule="evenodd" id="Subtract" />
          </g>
          <path d={svgPaths.p2f037200} fill="var(--fill-0, #D3A0A0)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function QuesstImage() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[178px] ml-px mt-0 overflow-clip relative rounded-[15px] w-[345px]" data-name="Quesst Image">
      <div className="absolute left-[-1px] size-[104px] top-[37px]" data-name="image 12">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover opacity-90 pointer-events-none size-full" src={imgImage12} />
      </div>
      <Text text="3" />
      <div className="absolute h-[163px] left-[76px] top-[7px] w-[79px]" data-name="Black White Modern  Simple Creative Studio Huge Logo (1) 2">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgBlackWhiteModernSimpleCreativeStudioHugeLogo12} />
      </div>
      <div className="absolute h-[163px] left-[178px] top-[7px] w-[79px]" data-name="Black White Modern  Simple Creative Studio Huge Logo (2) 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgBlackWhiteModernSimpleCreativeStudioHugeLogo21} />
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[194px] place-items-start relative">
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-0 mt-[33px] not-italic relative text-[#1c1c1c] text-[20px] text-nowrap">Steam Navigation Redesign</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Light',sans-serif] leading-[normal] ml-0 mt-[60px] not-italic relative text-[#1c1c1c] text-[14px] w-[344px]">Simplifying feature discovery on the Steam mobile app</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-0 mt-0 not-italic relative text-[#585858] text-[14px] text-nowrap">FALL 2025</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-[250px] mt-0 not-italic relative text-[#585858] text-[14px] text-nowrap">Product Design</p>
      <Text1 text="View Project" additionalClassNames="ml-0 mt-[94px]" />
    </div>
  );
}

function Quesst() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="QUESST">
      <QuesstImage />
      <Group />
    </div>
  );
}

function QuesstImage1() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[178px] ml-0 mt-0 overflow-clip relative rounded-[15px] w-[345px]" data-name="Quesst Image">
      <div className="absolute h-[233px] left-[-4px] top-[-14px] w-[349px]" data-name="image 10">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgImage10} />
      </div>
      <Text text="3" />
    </div>
  );
}

function Group1() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[194px] place-items-start relative">
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-0 mt-[33px] not-italic relative text-[#1c1c1c] text-[20px] text-nowrap">QUESST</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Light',sans-serif] leading-[normal] ml-0 mt-[59px] not-italic relative text-[#1c1c1c] text-[14px] text-nowrap">{`Designing for NASA's X-59 Project`}</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-0 mt-0 not-italic relative text-[#585858] text-[14px] text-nowrap">SPRING 2025</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-[282px] mt-0 not-italic relative text-[#585858] text-[14px] text-nowrap">Internship</p>
      <Text1 text="View Project" additionalClassNames="ml-px mt-[93px]" />
    </div>
  );
}

function Quesst1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="QUESST">
      <QuesstImage1 />
      <Group1 />
    </div>
  );
}

function QuesstImage2() {
  return (
    <div className="[grid-area:1_/_1] bg-white h-[178px] ml-px mt-0 overflow-clip relative rounded-[15px] w-[345px]" data-name="Quesst Image">
      <div className="absolute h-[233px] left-[-4px] top-[-14px] w-[349px]" data-name="image 10" />
      <Text text="3" />
      <div className="absolute h-[143px] left-[67px] top-[19px] w-[207px]" data-name="IPAD 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgIpad1} />
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] ml-0 mt-[194px] place-items-start relative">
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-0 mt-[33px] not-italic relative text-[#1c1c1c] text-[20px] text-nowrap">Resource Bridge</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Light',sans-serif] leading-[1.16] ml-0 mt-[59px] not-italic relative text-[#1c1c1c] text-[14px] w-[344px]">Designing a kiosk to help unhoused people find local essential resources</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-0 mt-0 not-italic relative text-[#585858] text-[14px] text-nowrap">WINTER 2025</p>
      <p className="[grid-area:1_/_1] font-['Larsseit:Medium',sans-serif] leading-[normal] ml-[249px] mt-0 not-italic relative text-[#585858] text-[14px] text-nowrap">Product Design</p>
      <Text1 text="View Project" additionalClassNames="ml-0 mt-[111px]" />
    </div>
  );
}

function Quesst2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid place-items-start relative shrink-0" data-name="QUESST">
      <QuesstImage2 />
      <Group2 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[42px] inset-[4.68%_2.26%_0_0] items-start leading-[0]">
      <Quesst />
      <Quesst1 />
      <Quesst2 />
    </div>
  );
}

function Categories() {
  return (
    <div className="absolute content-stretch flex gap-[20px] inset-[0_0_98.35%_2.82%] items-center leading-[1.3] not-italic text-[14px]" data-name="Categories">
      <p className="font-['Larsseit:Bold',sans-serif] relative shrink-0 text-[#1c1c1c] w-[45px]">Recent</p>
      <p className="font-['Larsseit:Medium',sans-serif] relative shrink-0 text-[#a29fa0] text-nowrap">Internship</p>
      <p className="font-['Larsseit:Medium',sans-serif] relative shrink-0 text-[#a29fa0] text-nowrap">Product Design</p>
      <p className="font-['Larsseit:Medium',sans-serif] relative shrink-0 text-[#a29fa0] text-nowrap">Redesign</p>
    </div>
  );
}

function Projects() {
  return (
    <div className="absolute h-[1090px] left-[24px] top-[437px] w-[354px]" data-name="Projects">
      <Frame2 />
      <Categories />
    </div>
  );
}

function HamburgerMenu() {
  return (
    <div className="absolute h-[20px] left-[346px] top-[72px] w-[23px]" data-name="hamburger menu">
      <div className="absolute inset-[-12.5%_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23 22.5">
          <g id="hamburger menu">
            <line id="Line 1" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeWidth="2.5" x1="1.25" x2="21.75" y1="1.25" y2="1.25" />
            <line id="Line 2" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeWidth="2.5" x1="1.25" x2="21.75" y1="11.25" y2="11.25" />
            <line id="Line 3" stroke="var(--stroke-0, #585858)" strokeLinecap="round" strokeWidth="2.5" x1="1.25" x2="21.75" y1="21.25" y2="21.25" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-[#faf9f5] h-[115px] left-0 overflow-clip rounded-[15px] top-0 w-[393px]">
      <HamburgerMenu />
      <p className="absolute font-['Larsseit:Bold',sans-serif] leading-[1.131] left-[22px] not-italic text-[#1c1c1c] text-[20px] text-nowrap top-[70px]">LIVIANNE</p>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-[#faf9f5] overflow-clip relative rounded-[30px] size-full" data-name="Landing page">
      <Frame1 />
      <div className="absolute bg-[rgba(191,217,153,0.5)] h-[87px] left-[23px] rounded-[15px] top-[1602px] w-[346px]" />
      <WelcomeBanner />
      <Introduction />
      <p className="absolute font-['Larsseit:Regular',sans-serif] italic leading-[1.3] left-[26px] text-[#d3a0a0] text-[16px] text-nowrap top-[1721px]">liviwong123@gmail.com</p>
      <Frame />
      <p className="absolute font-['Larsseit:Bold',sans-serif] leading-[normal] left-[97px] not-italic text-[#70b074] text-[20px] text-nowrap top-[1636px]">Thank you for viewing!</p>
      <LandingPageHelper additionalClassNames="left-[23px] top-[464px]" />
      <LandingPageHelper additionalClassNames="left-[25px] top-[1587px]" />
      <Projects />
    </div>
  );
}