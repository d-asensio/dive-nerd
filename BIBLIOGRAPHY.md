# Bibliography

This bibliography gathers the resources I read through to learn about decompression theory and some notes I took along the process. Be advised that I don't have any physiology-related background or anything that relates, so my comments can be very wrong 😄.

## Papers

- [Understanding M-Values](https://www.shearwater.com/wp-content/uploads/2019/05/understanding_m-values.pdf) - By Erik C. Baker (Really good one)

- [Clearing Up The Confusion About “Deep Stops”](https://www.shearwater.com/wp-content/uploads/2012/08/Deep-Stops.pdf) - By Erik C. Baker
- [Oxygen Toxicity Calculations](https://www.shearwater.com/wp-content/uploads/2012/08/Oxygen_Toxicity_Calculations.pdf) - By Erik C. Baker
- [Introductory “Lessons” About Dissolved Gas Decompression Modeling](https://www.shearwater.com/wp-content/uploads/2012/08/Introductory-Deco-Lessons.pdf) - By Erik C. Baker
- [Calculating the no-stop time](https://www.shearwater.com/wp-content/uploads/2012/08/No-Stop_Time.pdf) - By Erik C. Baker

- [Lizardland DIY Deco](http://www.lizardland.co.uk/DIYDeco.html)

- [ZH-L8ADT: A New Decompression Model To Increase Safety For
Dive Computers](https://cronatec.ch/wp-content/uploads/2021/09/ZH-L8ADT.pdf)
    - **Summary:** This algorithm uses the original tissue models developed by Bülman in conjunction with some other considerations such as:
        - **Gas bubbles in the venous blood:**
        - **Gas bubbles in the arterial blood and in the tissues:** Bubbles formed in a tissue or carried by the arterial blood stream can obstruct capillaries and affect tissue half-times. Resulting in a slower desaturation and also a lower critical supersaturation of the affected area. The algorithm is capable of detecting such situation and adapt to prevent further damage of the tissue. Quoting the article (section 3.3.2):
            > This leads to much shorter nostop limits and a decompression schedule which begins with deeper decompression stops and which lasts longer.
        - **Adaptation to work:** Takes into account air consumption rate and skin temperature to barey calculate the workload of the diver. Original Bühlmann algorithm takes 50 Watts as a basis. The article doesn't really go deep into the how, but it is admitted that it's a very rough and simplifyed consideration.

        - **Adaptation to cold water:** The model is able to change the saturation speed and the critical supersaturation of the muscle and skin ompartments according to the diver's exertion and/or cooling.

        To my understanding, the adaptation (ADT) part of this algorithm is useful when the diver has taken risks (Non-Limit diving, extensive repetitive diving, "jojo" dives, fast ascents, missed deco stops, dived in very cold water, etc.) because it is able to rearange the stops taking into account this information. Other than that (if no risks are taken) it should be the same as the ZH-L8 (and friends) with no gradient factors.

## Blogs

- [The Theoretical Diver](https://thetheoreticaldiver.org/wordpress/)

## Deco concepts

- [Ratio decompression](https://en.wikipedia.org/wiki/Ratio_decompression)

- [In-water recompression](https://en.wikipedia.org/wiki/In-water_recompression)

## Dive planners

- [MultiDeco](https://www.hhssoftware.com/multideco/)
- [V-Planner](https://www.hhssoftware.com/v-planner/)
- [TruDive Planner](http://getfreephase.com/trudive-planner/)
- [iDeco Pro](https://apps.apple.com/us/app/ideco-pro/id329772936)
- [Baltic deco planner](http://www.balticdecoplanner.com/)

## Videos

- [Mark Powell: Intro to Deco Theory & Deep Stops](https://www.youtube.com/watch?v=fhfNph3GKRw&list=PLdGfAkSUGpmFkT7d902_Wk8VZUNO-kgVhoi)
- [RF3.0- Decompression Methods](https://www.youtube.com/watch?v=pH5zw_fi5RE)
- [Rebreather Basics](https://www.youtube.com/watch?v=Bjm8lt96F4w)

## Books

- (PENDING) [Deco for Divers: A Diver's Guide to Decompression Theory and Physiology](https://www.amazon.es/Deco-Divers-Decompression-Theory-Physiology/dp/1905492294) - By: Mark Powell

## Articles

- (PENDING) [Decompression, Deep Stops and the Pursuit of Precision in a Complex World](https://gue.com/blog/decompression-deep-stops-and-the-pursuit-of-precision-in-a-complex-world/)
    - [Part II](https://gue.com/blog/part-two-tech-divers-deep-stops-and-the-coming-apocalypse/)
    - [Part III](https://gue.com/blog/part-three-bubble-wise-pound-foolish-are-deep-stops-dangerous/)
    - [Part IV](https://gue.com/blog/decompression-series-part-four-finding-shelter-in-an-uncertain-world/)

- (PENDING) [Diving Computers & the Deco Algorithms Babylon](https://www.t101.ro/blog/diving-computers-the-deco-babylon/)

## Physiology concepts

- [Shunt](https://en.wikipedia.org/wiki/Shunt_(medical))

- [Pulmonary Shunt](https://en.wikipedia.org/wiki/Pulmonary_shunt)

- [Foramen Ovale](https://en.wikipedia.org/wiki/Foramen_ovale_(heart))

- (PENDING) [Doppler Ultrasound](https://fetalmedicine.org/var/uploads/web/Doppler/Doppler%20Ultrasound%20-%20Principles%20and%20practice.pdf)

## Other scuba diving software

- [Subsurface Divelog](https://subsurface-divelog.org/documentation/subsurface-4-user-manual/)