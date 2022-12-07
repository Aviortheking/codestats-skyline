/*- TO CHANGE START */

// Number of XPs in a day for each months
jan = [6433, 12574, 12013, 14896, 6242, 12306, 11732, 22842, 25780, 7375, 1030, 2676, 8857, 7948, 11429, 21389, 13025, 5335, 8942, 4457, 14171, 9951, 10766, 7780, 29865, 24567, 7702, 24382, 17697, 12100, 16698];
feb = [21093, 2887, 10773, 10345, 5897, 6255, 20849, 17071, 17168, 8504, 27323, 33772, 16624, 16915, 14535, 10766, 24339, 14177, 24986, 13760, 47418, 59739, 19918, 12892, 20671, 13143, 9618, 9389, 0, 0];
mar = [23643, 29897, 23874, 26867, 20092, 8363, 6073, 10425, 26663, 111087, 30647, 19681, 19344, 15507, 17636, 12541, 7369, 17568, 17077, 15472, 9506, 6338, 8851, 21544, 24243, 7023, 5401, 7157, 20584, 23584, 16505];
apr = [18005, 20973, 15606, 31164, 19681, 6483, 9336, 19675, 16235, 20264, 24966, 5373, 15940, 11196, 31502, 19592, 12128, 5567, 4127, 16426, 12003, 9349, 30876, 16646, 17918, 10468, 29463, 17615, 33916, 26946];
may = [7170, 23252, 9804, 31352, 15586, 14805, 11428, 1109, 17412, 10792, 15063, 26795, 21759, 16454, 6553, 4298, 18480, 12895, 9416, 15555, 11009, 8964, 12185, 14078, 13741, 12137, 16978, 9225, 5745, 11983, 16882];
jun = [18025, 9358, 14984, 9903, 8786, 9800, 4640, 10981, 243, 9525, 23704, 6319, 5829, 15594, 27113, 21561, 12550, 7705, 5961, 17777, 5608, 23655, 15029, 6724, 17000, 10188, 656, 2250, 15440, 14002];
jul = [28390, 11561, 7373, 6742, 17094, 29206, 11565, 8060, 14140, 30700, 24018, 20970, 12356, 23407, 15595, 18958, 27610, 22698, 14382, 18506, 11033, 26381, 15258, 7264, 16294, 20051, 7199, 3656, 9122, 12367, 7399];
aug = [37781, 16170, 5423, 7281, 625, 17514, 14275, 11376, 4164, 6922, 12616, 14079, 5546, 10987, 0, 2947, 16041, 9591, 8883, 8308, 10195, 12063, 13868, 8181, 11185, 19938, 9788, 6687, 12555, 22733, 5933];
sep = [8156, 14355, 7410, 7958, 5638, 1974, 7015, 3924, 559, 8996, 19943, 28816, 26180, 18516, 9069, 14086, 7128, 11096, 16909, 10968, 15450, 7919, 10128, 7433, 3533, 12644, 25574, 30150, 21302, 10383];
oct = [7109, 11067, 13580, 24341, 10774, 11742, 19973, 23626, 30664, 9417, 16783, 9260, 14108, 9489, 4830, 28002, 21885, 16954, 15868, 16902, 19634, 22134, 24960, 11625, 10090, 13084, 20795, 8160, 11223, 5578, 1741];
nov = [0, 13537, 30169, 11276, 6862, 13438, 10021, 14033, 11938, 10941, 3634, 23317, 33661, 22821, 30040, 13944, 13980, 10466, 8872, 9020, 10166, 37281, 31896, 15089, 15184, 14277, 8070, 13321, 11396, 9223];
dec = [8826, 11600, 5676, 8647, 8214, 26350, 12609, 9070, 21900, 17233, 11803, 17161, 12652, 2534, 5066, 26487, 27623, 21798, 17840, 11337, 3662, 9396, 16589, 242, 0, 0, 2674, 1892, 98, 10846, 9384];

// the maximum number of XPs in a day
max = 111087;

// the minimum number of XPs in a day
min = 0;

// Left aligned text for the username
text = "Aviortheking";

// Right aligned text for the year
year = "2021";
/* TO CHANGE END -*/

// Define the maximum height
maxHeight = 100;

// Define the spacing between values
spacing = 0;

// Define the base height
baseHeight = 20;

// Define the text height
textHeight = baseHeight / 2;

// define the minimum value to be before displaying
minValue = 0;

barSize = 10;

// 33 = 31 days + 2 border)
baseWidth = barSize * 33;

// 14 = 12 months + 2 border
baseLength = barSize * 14;


// Function that generate a whole month
module generateMonth(month, offset = 0) {

    // loop through each days for the month
    for (index = [0 : len(month) -1 ]) {

        // get the XP
        it = month[index];

        // Render the bar
        translate([
            barSize + (barSize + spacing) * index,
            barSize + (barSize + spacing) * offset,
            baseHeight - 1 // put it in the bottom part to make sure they are one
        ]) {
            cube([
                barSize,
                barSize,
                it < minValue ? 0 : it * maxHeight / max + 1 // make it higher for the reason of the comment above
            ]);
        }
    }
}

// merge everyting
union() {
    // remove part of bottom with text
    difference() {

        cube([baseWidth, baseLength, baseHeight]);

        // if year is specified
        if (len(year) > 0) {

            // move the year to the right
            translate([baseWidth - 5, 1.9, (baseHeight - textHeight) / 2]) {

                // rotate it
                rotate([90, 0, 0]) {

                    // extrude the base
                    linear_extrude(2)
                    text(year, size=textHeight, halign="right");
                }
            }
        }

        // move the username to the left
        translate([5, 1.9, (baseHeight - textHeight) / 2]) {

            // rotate it
            rotate([90, 0, 0]) {

                // extrude the base
                linear_extrude(2)
                text(text, size=textHeight);
            }
        }
    }

    // Generate each months :D
    months = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];

    for (monthIndex = [ 0 : 11 ]) {
        generateMonth(months[monthIndex], monthIndex);
    }
}
