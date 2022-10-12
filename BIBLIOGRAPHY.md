# Bibliography

## Papers

- [ZH-L8ADT: A New Decompression Model To Increase Safety For
Dive Computers](https://cronatec.ch/wp-content/uploads/2021/09/ZH-L8ADT.pdf)
    - **Summary:** This algorithm uses the original tissue models developed by Bülman in conjunction with some other considerations such as:
        - **Gas bubbles in the venous blood:**
        - **Gas bubbles in the arterial blood and in the tissues:** Bubbles formed in a tissue or carried by the arterial blood stream can obstruct capillaries and affect tissue half-times. Resulting in a slower desaturation and also a lower critical supersaturation of the affected area. The algorithm is capable of detecting such situation and adapt to prevent further damage of the tissue. Quoting the article (section 3.3.2):
            > This leads to much shorter nostop limits and a decompression schedule which begins with deeper decompression stops and which lasts longer.
        - **Adaptation to work:** Takes into account air consumption rate and skin temperature to barey calculate the workload of the diver. Original Bühlmann algorithm takes 50 Watts as a basis. The article doesn't really go deep into the how, but it is admitted that it's a very rough and simplifyed consideration.

        - **Adaptation to cold water:** 

        To my understanding, the adaptation (ADT) part of this algorithm is useful when the diver has taken risks (Non-Limit diving, extensive repetitive diving, "jojo" dives, fast ascents, missed deco stops, dived in very cold water, etc.) because it is able to rearange the stops taking into account this information. Other than that (if no risks are taken) it should be the same as the ZH-L8 (and friends) with no gradient factors.

## Videos

- [Mark Powell: Intro to Deco Theory & Deep Stops](https://www.youtube.com/watch?v=fhfNph3GKRw&list=PLdGfAkSUGpmFkT7d902_Wk8VZUNO-kgVhoi)

## Books

- (PENDING) [Deco for Divers: A Diver's Guide to Decompression Theory and Physiology](https://www.amazon.es/Deco-Divers-Decompression-Theory-Physiology/dp/1905492294) - By: Mark Powell

## Physiology concepts

- [Shunt](https://en.wikipedia.org/wiki/Shunt_(medical))

- [Pulmonary Shunt](https://en.wikipedia.org/wiki/Pulmonary_shunt)

- [Foramen Ovale](https://en.wikipedia.org/wiki/Foramen_ovale_(heart))

- (PENDING) [Doppler Ultrasound](https://fetalmedicine.org/var/uploads/web/Doppler/Doppler%20Ultrasound%20-%20Principles%20and%20practice.pdf)