<template>
  <q-card>
    <q-card-section class="row items-center q-pb-none">
      <div class="text-h6 fontsize-14">Cooling Strategies</div>
      <q-space />
      <q-btn icon="close" color="primary" v-close-popup>Close</q-btn>
    </q-card-section>
    <q-card-section>
      <div class="fontsize-12">
        If you need to lower your body temperature, here are the best ways to do
        it (click on a intervention for more info):
      </div>
      <div class="row">
        <CoolingInterventionCard
          v-for="(item, index) in coolingStrategies"
          :key="index"
          :strategy="item"
          @click="onCardClick(item)"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CoolingInterventionCard from './CoolingInterventionCard.vue';
import { CoolingStrategy } from './models';

export default defineComponent({
  name: 'CoolingInterventionList',
  components: {
    CoolingInterventionCard,
  },
  setup(props, { emit }) {
    const onCardClick = (item: CoolingStrategy) => {
      emit('show-info', item);
    };

    const coolingStrategies: Array<CoolingStrategy> = [
      {
        text: 'Turn on a Fan',
        imageUrl: 'images/fan.jpg',
        description: `
        <div class="text-h6 q-mt-md">How to best use a fan:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Position the fan to create optimal airflow in the room.</li>
          <li>Adjust the fan speed according to your comfort level.</li>
          <li>Use an oscillating fan to circulate air more evenly in the room.</li>
          <li>Clean the fan blades and vents regularly to maintain efficiency.</li>
          <li>Combine the fan with other cooling methods, such as open windows or air conditioning.</li>
        </ul>
        <div class="text-h6 q-mt-md">When a fan should be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>During the day when it's too hot outside, and opening windows would let in hot air.</li>
          <li>When humidity levels are moderate to low, as a fan can help evaporate sweat, making you feel cooler.</li>
        </ul>
        <div class="text-h6 q-mt-md">When a fan should not be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>In extremely high humidity levels, as a fan may not provide much cooling effect.</li>
        </ul>
        <div class="text-h6 q-mt-md">Things that can make a fan more effective:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Using a window fan to pull in cool air from outside or push hot air out.</li>
          <li>Placing a bowl of ice or a wet towel in front of the fan to create a cooler breeze.</li>
          <li>Positioning the fan to circulate air around the entire room, rather than just directing it at one spot.</li>
          <li>Using ceiling fans in conjunction with other cooling methods to maximize their effectiveness.</li>
          <li>Ensuring that the fan is well-maintained and clean to optimize performance.</li>
        </ul>
        `,
      },
      {
        text: 'Hand/Foot Immersion',
        imageUrl: 'images/foot-immersion.jpg',
        description: `
        <div class="text-h6 q-mt-md">How to best use hand/foot immersion:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Fill a basin or tub with cool or cold water, depending on your tolerance and desired cooling effect.</li>
          <li>Submerge your hands and/or feet in the water for 10-20 minutes at a time.</li>
          <li>Wiggle your fingers and toes occasionally to improve circulation and enhance the cooling effect.</li>
          <li>Pat your hands and feet dry with a towel after immersion, and avoid exposing them to heat immediately afterwards.</li>
          <li>Combine hand/foot immersion with other cooling methods, such as a fan, for better results.</li>
        </ul>
        <div class="text-h6 q-mt-md">When hand/foot immersion should be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>When you need a quick and easy way to cool down your body.</li>
          <li>During breaks from physical activities or work in hot environments.</li>
          <li>As a means to recover from heat exposure or reduce the risk of heat-related illnesses.</li>
        </ul>
        <div class="text-h6 q-mt-md">When hand/foot immersion should not be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>When you have open wounds or infections on your hands or feet, as it may worsen the condition.</li>
          <li>In cases of severe cold intolerance or conditions like Raynaud's phenomenon, as it may cause discomfort or trigger symptoms.</li>
          <li>When there is a risk of water contamination or poor hygiene in the immersion area.</li>
        </ul>
        <div class="text-h6 q-mt-md">Things that can make hand/foot immersion more effective:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Using water at a temperature that is comfortable yet effective for cooling.</li>
          <li>Adding ice to the water to enhance the cooling effect, if tolerated.</li>
          <li>Immersing both hands and feet simultaneously to maximize the surface area for heat exchange.</li>
          <li>Ensuring proper water hygiene by changing the water regularly and using clean containers.</li>
          <li>Complementing hand/foot immersion with other cooling strategies, such as drinking cool fluids or using fans.</li>
        </ul>
        `,
      },
      {
        text: 'Sit Down Quietly',
        imageUrl: 'images/sitting-quietly.jpg',
        description: `
        <div class="text-h6 q-mt-md">How to best use sitting down quietly for cooling:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Find a cool, shaded, or well-ventilated area to sit down.</li>
          <li>Choose a comfortable chair or surface that allows you to relax and rest.</li>
          <li>Close your eyes and take slow, deep breaths, focusing on exhaling slowly to promote relaxation.</li>
          <li>Loosen any tight clothing and remove unnecessary layers to allow your body to cool down more efficiently.</li>
          <li>Combine sitting down quietly with other cooling methods, such as a fan, air conditioning, or drinking cool fluids.</li>
        </ul>
        <div class="text-h6 q-mt-md">When sitting down quietly should be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>After physical exertion or exposure to heat, to allow your body to recover and regulate its temperature.</li>
          <li>During a break from work or activities in hot environments to prevent overheating.</li>
          <li>As a relaxation technique to reduce stress and anxiety, which can contribute to overheating.</li>
        </ul>
        <div class="text-h6 q-mt-md">When sitting down quietly should not be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>If you are experiencing heat exhaustion or heat stroke, seek immediate medical attention instead of just sitting down.</li>
          <li>When sitting down quietly is not enough to cool down, and you should use additional cooling methods or seek a cooler environment.</li>
        </ul>
        <div class="text-h6 q-mt-md">Things that can make sitting down quietly more effective:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Practicing relaxation techniques, such as meditation or deep breathing exercises, to further promote calmness and reduce body heat.</li>
          <li>Positioning yourself near a fan or air conditioner, to enhance the cooling effect while sitting.</li>
          <li>Using a cold pack, ice, or a wet towel on your forehead or the back of your neck to help cool down more effectively.</li>
          <li>Drinking cool fluids to help lower your body temperature from the inside.</li>
          <li>Complementing the sitting down quietly method with other cooling strategies, such as removing unnecessary clothing or using a fan.</li>
        </ul>
        `,
      },
      {
        text: 'Drink Cool Fluids',
        imageUrl: 'images/ice-water.jpg',
        description: `
        <div class="text-h6 q-mt-md">How to best use drinking cool fluids for cooling:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Drink water or electrolyte-rich beverages to stay hydrated and replace lost electrolytes through sweating.</li>
          <li>Avoid consuming large amounts of caffeine or alcohol, as they can dehydrate you and increase your body temperature.</li>
          <li>Sip on your cool beverage slowly, allowing your body to gradually adjust to the temperature change.</li>
          <li>Keep a reusable water bottle with you and refill it with cold water frequently to maintain a steady supply of cool fluids.</li>
          <li>Combine drinking cool fluids with other cooling methods, such as sitting down quietly or using a fan.</li>
        </ul>
        <div class="text-h6 q-mt-md">When drinking cool fluids should be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Throughout the day, to maintain proper hydration levels and prevent heat-related illnesses.</li>
          <li>Before, during, and after physical activities, especially in hot environments, to replenish fluids lost through sweating.</li>
          <li>When feeling overheated, to help lower your body temperature more effectively.</li>
        </ul>
        <div class="text-h6 q-mt-md">When drinking cool fluids should not be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Drinking too much water too quickly, as it can lead to hyponatremia, a potentially dangerous condition caused by low sodium levels.</li>
        </ul>
        <div class="text-h6 q-mt-md">Things that can make drinking cool fluids more effective:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Adding ice cubes or crushed ice to your drink to make it cooler and more refreshing.</li>
          <li>Drinking fluids containing electrolytes, such as sports drinks, coconut water, or diluted fruit juice, to replace lost minerals and help maintain proper hydration levels.</li>
          <li>Using an insulated water bottle to keep your fluids cold for a longer period of time.</li>
          <li>Pairing cool fluids with other cooling strategies, such as using a fan or air conditioning, to maximize their effectiveness.</li>
          <li>Monitoring your fluid intake to ensure you're drinking enough throughout the day, especially in hot weather or during physical activities.</li>
        </ul>
         `,
      },
      {
        text: 'Drape a Wet Towel',
        imageUrl: 'images/tea-towel.jpg',
        description: `
        <div class="text-h6 q-mt-md">How to best use a wet towel for cooling:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Soak a towel or cloth in cold water, wring it out slightly, so it remains damp but not dripping wet.</li>
          <li>Drape the wet towel over your head, neck, shoulders, or other areas where you feel hot.</li>
          <li>Re-wet the towel as needed to maintain its cooling effect when it starts to dry out or warm up.</li>
          <li>Use a breathable, lightweight fabric like cotton for the towel to maximize the evaporative cooling effect.</li>
          <li>Combine the wet towel method with other cooling strategies, such as fans or air conditioning, for better results.</li>
        </ul>
        <div class="text-h6 q-mt-md">When draping a wet towel should be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>When you need a quick, convenient, and low-cost way to cool down.</li>
          <li>During breaks from physical activities or work in hot environments.</li>
          <li>As a means to recover from heat exposure or reduce the risk of heat-related illnesses.</li>
        </ul>
        <div class="text-h6 q-mt-md">When draping a wet towel should not be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>When you have open wounds, skin infections, or rashes, as the wet towel may exacerbate the condition or cause discomfort.</li>
          <li>When the humidity is very high, as the evaporative cooling effect of the wet towel might be reduced.</li>
        </ul>
        <div class="text-h6 q-mt-md">Things that can make draping a wet towel more effective:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Using cold or icy water to soak the towel, enhancing the initial cooling effect.</li>
          <li>Placing the wet towel in front of a fan or air conditioner, to increase the evaporative cooling effect.</li>
          <li>Using a towel size that is suitable for the body part you are trying to cool, maximizing contact with the skin.</li>
          <li>Regularly re-wetting the towel to maintain its cooling effect over a longer period.</li>
          <li>Complementing the wet towel method with other cooling strategies, such as drinking cool fluids or using fans.</li>
        </ul>
        `,
      },
      {
        text: 'Remove Unnecessary Clothing',
        imageUrl: '/images/clothing.jpg',
        description: `
        <div class="text-h6 q-mt-md">How to best use removing unnecessary clothing for cooling:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Remove or loosen any tight-fitting clothing that may restrict airflow or trap heat.</li>
          <li>Wear lightweight, breathable fabrics, such as cotton or linen, to allow for better air circulation and moisture absorption.</li>
          <li>Choose light-colored clothing to reflect sunlight and reduce heat absorption.</li>
          <li>Wear moisture-wicking materials to help evaporate sweat and keep your body cooler.</li>
          <li>Combine removing unnecessary clothing with other cooling methods, such as using a fan or drinking cool fluids.</li>
        </ul>
        <div class="text-h6 q-mt-md">When removing unnecessary clothing should be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>During hot weather, to maximize airflow around your body and prevent overheating.</li>
          <li>When engaging in physical activities, to allow for better evaporation of sweat and prevent heat-related illnesses.</li>
          <li>When feeling overheated or experiencing symptoms of heat exhaustion, to help lower your body temperature more effectively.</li>
        </ul>
        <div class="text-h6 q-mt-md">When removing unnecessary clothing should not be used:</div>
        <ul class="q-mt-none fontsize-12">
          <li>In situations where removing clothing may be inappropriate, such as public settings or formal events.</li>
          <li>When exposure to direct sunlight may increase the risk of sunburn, consider wearing lightweight, long-sleeved clothing and a hat to protect your skin.</li>
        </ul>
        <div class="text-h6 q-mt-md">Things that can make removing unnecessary clothing more effective:</div>
        <ul class="q-mt-none fontsize-12">
          <li>Opting for loose-fitting clothes that allow for better airflow and evaporation of sweat.</li>
          <li>Wearing clothing made from natural fibers or moisture-wicking materials to enhance cooling properties.</li>
          <li>Pairing the removal of unnecessary clothing with other cooling strategies, such as using a fan or drinking cool fluids, to maximize their effectiveness.</li>
          <li>Considering sun protection measures, such as wearing a hat, sunglasses, and applying sunscreen, when removing clothing exposes more skin to sunlight.</li>
        </ul>
        `,
      },
    ];
    return { onCardClick, coolingStrategies };
  },
});
</script>
