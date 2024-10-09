# jvm-options-selector

This tool is designed to help configure JVM parameters easily, particularly for selecting appropriate garbage collection strategies and fine-tuning memory settings. The various GC options are tailored to the JDK versions they are compatible with.
This code represents the JavaScript logic for a "JVM Options" tool that allows users to configure and select JVM options based on the JDK version and garbage collector they are using. Here's a breakdown of the key functionality.
## Clipboard Copy Functionality:

The user can copy the selected JVM options to the clipboard, with a modal confirmation that pops up once the copy action is successful.

## Reset Functionality:

The clearOptions() function resets all selections and input fields, allowing the user to start over.

## JDK Version and Garbage Collector Selection:

The user selects a JDK version, and the tool dynamically updates the available garbage collectors (gcType) based on that version.
When a GC is selected, relevant JVM options are populated.

## JVM Option Configuration:

Predefined options such as -Xms (Initial Heap Size), -Xmx (Maximum Heap Size), and -XX:MaxMetaspaceSize are displayed with default values.
Additional JVM options are shown depending on the selected GC, including common GC-specific flags like -XX:+UseG1GC or -XX:+UseParallelGC.

## Editable Options:

For some options, users can enter custom values (e.g., number of threads for ParallelGCThreads or region size for G1HeapRegionSize).
Dynamic Updates:

As users select options (via checkboxes) or enter custom values, the text area displaying the selected JVM options is updated in real-time.

## Custom JVM Options:

Users can add their own JVM options through an input field and these are added to the final list of selected options.