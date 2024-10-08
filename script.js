const gcSupportByJDK = {
  jdk8: {
    default: 'parallelgc',
    supported: ['parallelgc', 'cms', 'g1gc']
  },
  jdk11: {
    default: 'g1gc',
    supported: ['parallelgc', 'g1gc', 'zgc']
  },
  jdk17: {
    default: 'g1gc',
    supported: ['parallelgc', 'g1gc', 'zgc', 'shenandoah']
  },
  jdk21: {
    default: 'g1gc',
    supported: ['parallelgc', 'g1gc', 'zgc', 'shenandoah']
  }
};
const jvmOptions = {
    parallelgc: {
      common: [
        { option: "-XX:+UseParallelGC", description: "Enables the Parallel garbage collector." },
        { option: "-XX:+UseAdaptiveSizePolicy", description: "Enables adaptive generation sizing." },
        { option: "-XX:ParallelGCThreads", description: "Sets the number of threads for parallel GC.", editable: true, defaultValue: "4", placeholder:"e.g, 4" }
      ],
      jdk8: [],
      jdk11: [],
    },
    cms: {
      common: [
        { option: "-XX:+UseConcMarkSweepGC", description: "Enables the Concurrent Mark-Sweep (CMS) garbage collector." },
        { option: "-XX:+CMSParallelRemarkEnabled", description: "Enables parallel remark phase during CMS collection." },
        { option: "-XX:CMSInitiatingOccupancyFraction", description: "Start CMS collection when heap is 75% full.", editable: true, defaultValue: "75", placeholder:"e.g, 75" }
      ],
      jdk8: [],
    },
    g1gc: {
      common: [
        { option: "-XX:+UseG1GC", description: "Enables the G1 garbage collector." },
        { option: "-XX:G1HeapRegionSize", description: "Sets the G1 heap region size.", editable: true, defaultValue: "32M", placeholder:"e.g, 32M" },
        { option: "-XX:MaxGCPauseMillis", description: "Sets a target for maximum GC pause time.", editable: true, defaultValue: "200", placeholder:"e.g, 200" }
      ],
      jdk8: [],
      jdk11: [],
      jdk17: [],
      jdk21: [],
    },
    zgc: {
      common: [
        { option: "-XX:+UseZGC", description: "Enables the Z Garbage Collector (ZGC)." },
        { option: "-XX:+ZUncommit", description: "Allows the heap to be uncommitted when unused." },
        { option: "-XX:ZUncommitDelay", description: "Sets the delay (in seconds) for uncommiting unused memory.", editable: true, defaultValue: "30", placeholder:"e.g, 30" }
      ],
      jdk11: [],
      jdk17: [],
      jdk21: [],
    },
    shenandoah: {
      common: [
        { option: "-XX:+UseShenandoahGC", description: "Enables the Shenandoah garbage collector." },
        { option: "-XX:+ShenandoahUncommit", description: "Uncommits memory when unused." },
        { option: "-XX:ShenandoahUncommitDelay", description: "Delay in seconds before uncommiting memory.", editable: true, defaultValue: "30", placeholder:"e.g, 30" }
      ],
      jdk17: [],
      jdk21: [],
    }
  };
const gcPrintOptions = {
  jdk8: [
    { option: "-XX:+PrintGC", description: "Prints basic GC information." },
    { option: "-XX:+PrintGCDetails", description: "Prints detailed GC information." },
    { option: "-XX:+PrintGCApplicationStoppedTime", description: "Prints the time that the application is stopped during GC." },
    { option: "-XX:+PrintGCApplicationConcurrentTime", description: "Prints the time that the application is running concurrent with GC." },
    { option: "-XX:+PrintAdaptiveSizePolicy", description: "Prints details about adaptive size policy decisions." },
    { option: "-XX:+PrintTenuringDistribution", description: "Prints tenuring distribution information." },
    { option: "-XX:+PrintGCTimeStamps", description: "Prints GC time stamps." },
    { option: "-XX:+PrintGCDateStamps", description: "Prints GC date stamps." },
    { option: "-XX:+PrintHeapAtGC", description: "Prints heap information before and after GC." },
    { option: "-XX:+PrintReferenceGC", description: "Prints information about reference processing." },
    { option: "-XX:+PrintClassHistogram", description: "Prints a class histogram after each GC." },
    { option: "-XX:+PrintStringTableStatistics", description: "Prints statistics about the string table." }
  ],
  jdk: [
    { option: "-Xlog:gc", description: "Logs basic GC information." },
    { option: "-Xlog:gc*:file=gc.log", description: "Logs detailed GC information to a file." },
    { option: "-Xlog:gc=debug", description: "Logs GC information at the debug level." },
    { option: "-Xlog:gc*,gc+ref=debug", description: "Logs GC and reference processing information at the debug level." },
    { option: "-Xlog:gc=trace", description: "Logs GC information at the trace level." },
    { option: "-Xlog:gc*,gc+ref=trace", description: "Logs GC and reference processing information at the trace level." },
    { option: "-Xlog:gc=info:file=gc.log:tags,time", description: "Logs GC information at the info level to a file with time tags." },
    { option: "-Xlog:gc=info:file=gc.log:tags,time:filecount=5,filesize=1M", description: "Logs GC information at the info level to a file with time tags, rotating files." }
  ]
}
  
  const selectedOptions = [];
  
  // Load GC options based on selected JDK version
  function loadGCOptions() {
    const selectedVersion = document.getElementById('jdkVersion').value;
    const gcSelector = document.getElementById('gcType');
    
    gcSelector.disabled = false;
    gcSelector.value = ''; // Reset GC selector
    // Get supported GC options for the selected JDK version
    const supportedGCs = gcSupportByJDK[selectedVersion].supported;
    const defaultGC = gcSupportByJDK[selectedVersion].default;
    gcSelector.innerHTML = ''; // Clear previous options
    // Add the supported GC options to the dropdown
    supportedGCs.forEach(gc => {
        const option = document.createElement('option');
        option.value = gc;
        option.textContent = gc.charAt(0).toUpperCase() + gc.slice(1);  // Capitalize GC name
        if (gc === defaultGC) {
          option.selected = true; // Set default GC as selected
        }
        gcSelector.appendChild(option);
    });
    loadJVMOptions(); // Clear previous JVM options
  }
  
  // Load JVM options based on selected GC and JDK version
  function loadJVMOptions() {
    const selectedVersion = document.getElementById('jdkVersion').value;
    const selectedGC = document.getElementById('gcType').value;
    const container = document.getElementById('gcOptionsContainer');
    const header = document.getElementById('gcOptionsHeader');
    container.innerHTML = ''; // Clear previous options
    if (selectedGC && selectedVersion && jvmOptions[selectedGC]) {
      let optionsAdded = false;
      // Add common options
      if (jvmOptions[selectedGC].common) {
        jvmOptions[selectedGC].common.forEach((option, index) => {
          addOptionToContainer(option, selectedGC, 'common', index, container);
          optionsAdded = true;
        });
      }

      // Add JDK version-specific options
      if (jvmOptions[selectedGC][selectedVersion]) {
        jvmOptions[selectedGC][selectedVersion].forEach((option, index) => {
          addOptionToContainer(option, selectedGC, selectedVersion, index, container);
          optionsAdded = true;
        });
      }
      // Show or hide the header based on whether options were added
      header.style.display = optionsAdded ? 'block' : 'none';
    } else {
      header.style.display = 'none';
    }
    updateSelectedOptions();
  }

  function addOptionToContainer(option, selectedGC, version, index, container) {
    // Create checkbox for the option
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `option${selectedGC}-${version}-${index}`;
    checkbox.value = option.option;
    checkbox.onchange = updateSelectedOptions;

    // Append checkbox and label to the container
    const label = document.createElement('label');
    label.htmlFor = `option${selectedGC}-${version}-${index}`;
    label.innerHTML = `<strong>${option.option}</strong> - ${option.description}`;

    // Create Container
    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(label);

    // If the option is editable, add an input field for the value
    if (option.editable) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = option.defaultValue;
      input.id = `${option.option}-value`;
      input.placeholder = `Enter value for ${option.option}`; // Add placeholder text
      input.oninput = updateSelectedOptions;  // Update options when input changes
      div.appendChild(input);
    }
    container.appendChild(div);
  }
  // Update selected options when checkboxes or text inputs are changed
  function updateSelectedOptions() {
    const selectedOptionsList = [];
    const selectedVersion = document.getElementById('jdkVersion').value;
    const selectedGC = document.getElementById('gcType').value;
    // Add Xms, Xmx, MaxMetaspace values
    const xms = document.getElementById('xms').value;
    const xmx = document.getElementById('xmx').value;
    const maxMetaspace = document.getElementById('maxMetaspace').value;
    selectedOptionsList.push(`-Xms${xms}`, `-Xmx${xmx}`, `-XX:MaxMetaspaceSize=${maxMetaspace}`);
    // Add checked JVM options
    if (selectedGC && selectedVersion && jvmOptions[selectedGC]) {
      // Add common options
      if (jvmOptions[selectedGC].common) {
        jvmOptions[selectedGC].common.forEach((option, index) => {
          const checkbox = document.getElementById(`option${selectedGC}-common-${index}`);
          if (checkbox.checked) {
            if (option.editable) {
              const inputValue = document.getElementById(`${option.option}-value`).value;
              selectedOptionsList.push(`${option.option}=${inputValue}`);
            } else {
              selectedOptionsList.push(option.option);
            }
          }
        });
      }

      // Add JDK version-specific options
      if (jvmOptions[selectedGC][selectedVersion]) {
        jvmOptions[selectedGC][selectedVersion].forEach((option, index) => {
          const checkbox = document.getElementById(`option${selectedGC}-${selectedVersion}-${index}`);
          if (checkbox.checked) {
            if (option.editable) {
              const inputValue = document.getElementById(`${option.option}-value`).value;
              selectedOptionsList.push(`${option.option}=${inputValue}`);
            } else {
              selectedOptionsList.push(option.option);
            }
          }
        });
      }
    }
    selectedOptionsList.push(...selectedOptions);
    // Update textarea with selected options
    document.getElementById('jvmOptions').value = selectedOptionsList.join('\n');
  }
  
  // Add a custom JVM option
  function addCustomOption() {
    const customOption = document.getElementById('customOption').value;
    if (customOption) {
      selectedOptions.push(customOption);
      updateSelectedOptions();
      document.getElementById('customOption').value = ''; // Clear input
    }
  }
  
  // Copy selected JVM options to clipboard and show modal
  function copyText() {
    const textarea = document.getElementById('jvmOptions');
    const textToCopy = textarea.value;
  
    // Use the Clipboard API to copy text
    navigator.clipboard.writeText(textToCopy).then(() => {
      showModal("Text copied successfully!");
    }).catch(err => {
      console.error('Error copying text: ', err);
      showModal("Failed to copy text.");
    });
  }

  function clearOptions() {
    const gcType = document.getElementById('gcType');
    const jdkVersion = document.getElementById('jdkVersion');
    const container = document.getElementById('gcOptionsContainer');
    const header = document.getElementById('gcOptionsHeader');

    // Reset gcType and jdkVersion dropdowns
    jdkVersion.value = '';
    gcType.value = '';
    gcType.disabled = true;

    // Clear all checkboxes and input fields
    container.innerHTML = ''; // Clear the container
    header.style.display = 'none'; // Hide the header

    // Clear the textarea
    document.getElementById('jvmOptions').value = '';

    // Reload the options
    loadJVMOptions();
  }
  
  // Show modal with a message
  function showModal(message) {
    const modal = document.getElementById('copyModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'block'; // Show the modal
    // Close modal when 'x' is clicked
    document.getElementById('closeModal').onclick = function() {
      modal.style.display = 'none';
    };
    // Close modal when user clicks outside the modal content
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  }