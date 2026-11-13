/* Week 8, Embedded AI: quiz bank and interactive labs. */
(function () {
  "use strict";
  const h = NES.h;
  const sub = (s) => "<sub>" + s + "</sub>";

  /* =====================================================================
     QUIZ BANK
     Each option: [text, isCorrect, explanation]
     ===================================================================== */
  const QUIZ = {
    why: [
      {
        q: "The course has covered sensors, processors and moving data between chips. What does embedded AI add on top of that?",
        options: [
          ["Analysing the sensor data directly on the device, for example detecting a wake word or an anomaly", true, "That is the lecture's point: instead of only collecting and forwarding data, the device itself interprets it and acts on the result."],
          ["A faster radio, so data reaches the cloud sooner", false, "Embedded AI does not change the radio. If anything it reduces how much has to be sent at all."],
          ["It removes the need for sensors", false, "The model still needs data, and that data comes from the sensors."],
          ["It removes the need for a processor", false, "The model has to run on something: the MCU, or an accelerator next to it."],
        ],
      },
      {
        q: "Which of these is one of the slide's examples of analysing data directly on the device?",
        options: [
          ["Backing up a database", false, "Not an embedded sensing task, and not on the slide."],
          ["Presence detection", true, "The slide shows wake-word detection, presence detection, anomaly detection and health parameter monitoring."],
          ["Compiling firmware", false, "Compiling happens on the developer's computer, before deployment."],
          ["Routing internet traffic", false, "That is a networking job, not on-device analysis of sensor data."],
        ],
      },
    ],

    blerp: [
      {
        q: "What does the L in BLERP stand for, and why does on-device processing help it?",
        options: [
          ["Learning: devices learn faster on their own", false, "BLERP is Bandwidth, Latency, Economics, Reliability, Privacy. Learning on the device is a separate topic at the end of the lecture."],
          ["Lifetime: the battery lasts forever", false, "Lifetime is not one of the five letters, and nothing lasts forever on a battery."],
          ["Latency: no round trip to the cloud, so the response is faster", true, "Local processing lowers the response time, which is what enables real-time applications such as early feedback to a user."],
          ["Licensing: no software licences are needed", false, "Licensing is not part of BLERP."],
        ],
      },
      {
        q: "1,000 microphones stream 16 kHz, 16-bit mono audio to the cloud. Roughly how much upstream bandwidth is that in total?",
        options: [
          ["About 256 kbit/s", false, "That is one device: 16,000 samples/s × 16 bit = 256 kbit/s. There are 1,000 of them."],
          ["About 32 Mbit/s", false, "1,000 devices produce 32 MB/s, but that is megabytes. In bits it is 8 times more."],
          ["About 16 Mbit/s", false, "This forgets both the 2 bytes per sample and the conversion from bytes to bits."],
          ["About 256 Mbit/s", true, "16,000 × 16 bit = 256 kbit/s per device, × 1,000 devices = 256 Mbit/s, all day long. That is the slide's 'the internet would explode'."],
        ],
      },
      {
        q: "In the slide's early wildfire detection example, what does a node send to the gateway?",
        options: [
          ["Only an alert, when its on-device model recognises fire-related gases", true, "The model runs on the node next to the Bosch BME688 gas sensor, so the ultra-low-power LoRaWAN mesh only carries alerts."],
          ["A continuous stream of raw gas readings", false, "That is exactly the cloud approach the example avoids: it would cost bandwidth and energy."],
          ["Video of the forest", false, "The nodes carry gas sensors, not cameras."],
          ["Nothing: it only stores data locally", false, "It does communicate: when fire is detected, it sends an alert to the gateway."],
        ],
      },
    ],

    "ai-ml-dl": [
      {
        q: "How do AI, ML and DL relate to each other?",
        options: [
          ["They are three unrelated fields", false, "The slide draws them as nested circles: each one sits inside the previous."],
          ["DL is a subset of ML, which is a subfield of AI", true, "AI is the broad goal, ML is the data-driven way of reaching it, and deep learning is the part of ML based on deep neural networks."],
          ["AI is a subset of deep learning", false, "It is the other way round: deep learning is the innermost circle."],
          ["ML and DL are the same thing", false, "DL is one family of ML techniques; there are many ML methods that are not deep neural networks."],
        ],
      },
      {
        q: "What makes machine learning different from other AI approaches, according to the slide?",
        options: [
          ["It always uses deep neural networks", false, "That describes deep learning, a subset of ML."],
          ["It only runs in the cloud", false, "This whole lecture is about running it on embedded devices."],
          ["It learns from data rather than following explicit rules", true, "That is the slide's definition: ML focuses on learning from data instead of explicit rules."],
          ["It attempts to perform complex tasks by mimicking human intelligence", false, "That is the slide's definition of AI as a whole, not what sets ML apart."],
        ],
      },
    ],

    "rules-vs-ml": [
      {
        q: "In the slide's braking code: current_speed = 10 m/s, distance_from_wall = 50 m, seconds_to_stop = 3 and safety_buffer = 1. Does applyBrakes() run?",
        options: [
          ["Yes, because 5 s is less than 50 m", false, "Seconds and metres cannot be compared. The rule compares two times."],
          ["Yes, because the speed is above 3", false, "The rule never compares the speed directly with anything; it uses the time until the crash."],
          ["It depends on the training data", false, "Conditional logic has no training data. It is deterministic: same inputs, same answer."],
          ["No: 50 / 10 = 5 s until the crash, which is not less than 3 + 1 = 4 s", true, "seconds_until_crash = 5 and the threshold is 4, so the condition 5 < 4 is false. Try it in the lab above."],
        ],
      },
      {
        q: "Which statement describes machine learning rather than conditional logic?",
        options: [
          ["It requires training data, but no human has to describe how to do the task", true, "That is why ML scales better: the model is learned from examples instead of being written by an expert."],
          ["It is deterministic and efficient", false, "The slide lists these as strengths of conditional logic."],
          ["It does not require training data", false, "That is conditional logic. ML needs data to learn from."],
          ["It needs a human who can write down how to do the task", false, "That is the weakness of conditional logic: nobody can write rules for reading handwriting pixel by pixel."],
        ],
      },
    ],

    tinyml: [
      {
        q: "What is TinyML?",
        options: [
          ["Any ML that runs outside a data centre, including PCs and smartphones", false, "That is the slide's definition of Edge AI, the broader term."],
          ["The subfield of ML/DL about running models on low-power, resource-constrained devices", true, "The slide marks this as the course's focus: the overlap of machine learning and embedded systems."],
          ["Machine learning models with fewer than 100 parameters", false, "TinyML is defined by the device it runs on, not by a parameter count."],
          ["A cloud service for training small models", false, "TinyML is about running models on the device, not about cloud services."],
        ],
      },
      {
        q: "Running a model on a smartphone instead of in the cloud is best described as...",
        options: [
          ["TinyML, because phones are small", false, "Phones are edge devices, but they are not the low-power, resource-constrained devices TinyML targets."],
          ["Cloud computing", false, "The whole point is that it does not run in the cloud."],
          ["Edge AI", true, "The slide's Edge AI definition explicitly lists PCs, smartphones and consumer electronics."],
          ["On-device learning", false, "On-device learning is about training on the device. Running a ready model is inference."],
        ],
      },
    ],

    "learning-model": [
      {
        q: "What is the goal of learning, according to the slide?",
        options: [
          ["Memorise every training example exactly", false, "A model that only memorises fails on future instances, which the goal explicitly includes."],
          ["Build the most complex model possible", false, "The slide asks for the simplest approximating model."],
          ["Write down the data generating process P as explicit rules", false, "P is unknown; that is why we learn a model from samples of it."],
          ["Build the simplest approximating model that explains past data and future instances from the data generating process", true, "Both halves matter: fit the dataset (x1, y1) ... (xN, yN), and generalise to new inputs such as xN+1."],
        ],
      },
      {
        q: "In the slide's diagram, what is ȳ" + sub("N+1") + "?",
        options: [
          ["The model's prediction for a new input x" + sub("N+1") + " that was not in the dataset", true, "The model has seen N examples. ȳN+1 is its estimate for the next one, for example '2' for a new handwritten digit."],
          ["The label of the last training example", false, "That is yN. The dataset stops at index N."],
          ["The number of training examples", false, "N is the number of examples; ȳN+1 is an output value."],
          ["The true value produced by P", false, "The bar marks an estimate made by the model, which may be wrong (hence the '2 (?)')."],
        ],
      },
    ],

    tasks: [
      {
        q: "Deciding from accelerometer data whether a forklift is idle or moving is which kind of task?",
        options: [
          ["Regression", false, "Regression outputs a continuous quantity. Here the answer is one of two labels."],
          ["Classification", true, "The possible outputs are the labels [idle, moving]; the slide shows outputs such as 'idle 96%, moving 4%'."],
          ["Segmentation", false, "Segmentation labels each part of an input, such as every pixel of an image."],
          ["Feature reduction", false, "Feature reduction compresses the input; it does not decide between labels."],
        ],
      },
      {
        q: "The slide lists counting the people in a room from radar data under which task?",
        options: [
          ["Classification", false, "Counting could be framed as choosing among classes 0, 1, 2..., but the slide lists it under regression because the output is a quantity."],
          ["Anomaly detection", false, "Anomaly detection flags unusual behaviour; it does not count."],
          ["Regression: the output is a number", true, "Like measuring the liquid level in a cup, the output is a value rather than a label."],
          ["Object detection", false, "The radar heat map is not used to draw boxes around objects here; the goal is the count."],
        ],
      },
    ],

    neuron: [
      {
        q: "A neuron has inputs x = (1, 2), weights w = (0.5, -1), bias b = 1 and a ReLU activation. What is its output?",
        options: [
          ["-0.5", false, "That is the weighted sum z = 0.5 - 2 + 1 = -0.5, before the activation. ReLU turns negative values into 0."],
          ["2.5", false, "Check the sign of the second weight: 2 × (-1) = -2."],
          ["0.5", false, "Recompute the weighted sum: 1 × 0.5 + 2 × (-1) + 1 = -0.5."],
          ["0", true, "z = 1 × 0.5 + 2 × (-1) + 1 = -0.5, and ReLU(z) = max(0, z) = 0."],
        ],
      },
      {
        q: "Why is a single neuron 'pretty useless by itself'?",
        options: [
          ["It can only draw one straight boundary, so it cannot solve problems such as XOR", true, "Its output only depends on which side of the line w1·x1 + w2·x2 + b = 0 the input lies. Try XOR in the lab: no line gets all four groups right."],
          ["It has no weights to learn", false, "It has one weight per input plus a bias."],
          ["Its activation is linear", false, "The slide's activation is non-linear (for example s-shaped). The limitation is the single straight boundary."],
          ["It cannot be trained", false, "A single neuron can be trained, for example with the perceptron rule in the lab."],
        ],
      },
    ],

    dense: [
      {
        q: "The slide's dense layer has 7 inputs and 5 output neurons. How many parameters (weights plus biases) does it have?",
        options: [
          ["35", false, "35 counts the weights (7 × 5) but forgets the 5 biases."],
          ["40", true, "7 × 5 = 35 weights, plus one bias per output neuron: 35 + 5 = 40."],
          ["12", false, "Adding inputs and outputs counts neurons, not connections."],
          ["42", false, "Biases belong to the output neurons (5 of them), not the inputs."],
        ],
      },
      {
        q: "How does the slide compute the output of a dense layer?",
        options: [
          ["x̄ + W × b", false, "The weights multiply the input; the bias is added."],
          ["max(x̄)", false, "That is a pooling-style operation, not a dense layer."],
          ["x̄ × W + b, which then goes through the activation", true, "The input vector times the weight matrix, plus the bias vector. Every output neuron is a weighted sum of all inputs."],
          ["W × b, without the input", false, "Without the input, the output would never depend on the data."],
        ],
      },
      {
        q: "A dense layer from 784 inputs to 128 neurons is stored as float32. How much memory do its parameters take?",
        options: [
          ["About 400 kB", true, "784 × 128 + 128 = 100,480 parameters × 4 bytes = 401,920 bytes. Already more than many MCUs have."],
          ["About 100 kB", false, "That would be 1 byte per parameter, i.e. int8. Float32 needs 4 bytes."],
          ["About 1.6 MB", false, "That would be 16 bytes per parameter."],
          ["About 50 kB", false, "Recompute the weight count: 784 × 128 is already over 100,000."],
        ],
      },
    ],

    dnn: [
      {
        q: "Which property of the multilayer perceptron does the slide highlight?",
        options: [
          ["It needs no training", false, "It still has to learn its weights from data."],
          ["It always uses less memory than a single neuron", false, "More layers mean more weights, so more memory."],
          ["It only works on images", false, "MLPs work on any vector input; the cat example is just one illustration."],
          ["It can approximate any continuous function", true, "Stacking layers of non-linear neurons lets the network represent very complex functions, such as 'is this bunch of pixels a cat?'. This is known as the universal approximation property."],
        ],
      },
      {
        q: "The slide's MLP has 5 inputs, three hidden layers of 5 neurons and 3 outputs. How many weights (not counting biases) does it have?",
        options: [
          ["108", false, "108 is the total including the 5 + 5 + 5 + 3 = 18 biases."],
          ["90", true, "5×5 + 5×5 + 5×5 + 5×3 = 25 + 25 + 25 + 15 = 90 weights."],
          ["75", false, "This forgets the last layer: 5 neurons to 3 outputs adds 15 weights."],
          ["23", false, "23 counts the neurons (5 + 5 + 5 + 5 + 3), not the connections between them."],
        ],
      },
    ],

    training: [
      {
        q: "How are the weights set before training starts?",
        options: [
          ["They are randomly initialised", true, "Training starts from a random guess and improves it step by step: make a guess, measure, optimise, repeat."],
          ["They are set equal to the labels", false, "Labels are outputs; weights have a different shape and meaning."],
          ["A human chooses each one", false, "Choosing weights by hand would be conditional logic again. Learning finds them."],
          ["They are copied from the loss function", false, "The loss function is a measure computed from the outputs, not a source of weights."],
        ],
      },
      {
        q: "What does the loss function measure?",
        options: [
          ["How many weights the network has", false, "That is the model size, which does not change during training."],
          ["How long training takes", false, "Training time is a cost, not the loss."],
          ["How far the computed output is from the label", true, "The loss is large when the predictions are wrong. Training changes the weights to move towards the minimum of this function."],
          ["The accuracy on the test data", false, "The loss is computed on the training data during training. Test data is kept apart for evaluation."],
        ],
      },
      {
        q: "With gradient descent, what happens if the learning rate is far too large?",
        options: [
          ["Training always converges faster", false, "Up to a point it does. Beyond that, each step overshoots further than the last."],
          ["Nothing changes", false, "The learning rate scales every update, so it changes everything."],
          ["The model gets more parameters", false, "The learning rate is a hyperparameter of training, not part of the model."],
          ["The weights overshoot the minimum and the loss can grow instead of shrinking", true, "Each step jumps across the valley of the loss curve and lands higher up. Try a large step size in the lab."],
        ],
      },
    ],

    "beyond-mlp": [
      {
        q: "Which point is on the slide's 'No, it is not that simple' side?",
        options: [
          ["Deep learning is proving effective at many tasks", false, "That is on the 'Yes' side."],
          ["Data labelling is mostly manual, so it is expensive and time-consuming", true, "The other 'No' point: training and running big models is computationally expensive."],
          ["Larger models need less data", false, "The slide says the opposite: larger models plus lots of data and compute."],
          ["Neural networks cannot learn from images", false, "They can, but images call for suitable architectures, such as CNNs."],
        ],
      },
      {
        q: "Why do images, audio and text often need other architectures than a multilayer perceptron?",
        options: [
          ["MLPs cannot have more than 10 inputs", false, "MLPs can have any number of inputs. The issue is what a flat vector throws away."],
          ["Images are not made of numbers", false, "They are: pixel values. But their arrangement matters."],
          ["The data has structure, such as neighbouring pixels or the order of words, that CNNs, RNNs and transformers exploit and a flat vector loses", true, "Treating a picture as a vector of pixels ignores which pixels are next to each other. Architectures built for each data type use that structure."],
          ["CNNs need no training data", false, "Every one of these architectures still needs data to train."],
        ],
      },
    ],

    continuum: [
      {
        q: "In the computing continuum, which level offers real-time operation with limited resources?",
        options: [
          ["Edge", true, "Edge nodes are the IoT, industrial or user devices themselves: close to the data, fast to react, but constrained."],
          ["Cloud", false, "The cloud has huge compute and storage, with high throughput but high latency."],
          ["Fog", false, "Fog is the intermediate layer of gateways and local servers doing pre-processing, caching, aggregation and filtering."],
          ["None: all levels are equally fast", false, "Each level trades latency against resources differently."],
        ],
      },
      {
        q: "In the slide's smart speaker example, which part runs at the edge?",
        options: [
          ["Speech recognition", false, "The slide puts speech recognition in the cloud."],
          ["Wake word detection and noise suppression", true, "The speaker listens locally for the wake word, and only then involves the cloud. Real solutions often use several levels."],
          ["The voice assistant's answer", false, "The voice assistant runs in the cloud in the example."],
          ["Everything, the cloud is not involved", false, "The example combines both levels."],
        ],
      },
    ],

    "edge-different": [
      {
        q: "Which statement describes ML on the edge rather than in the cloud?",
        options: [
          ["Virtually unlimited compute, memory and storage", false, "That is the cloud."],
          ["Data can be processed in batches", false, "That is the cloud, which is less latency-sensitive. Edge devices process streams in real time."],
          ["After deployment, updating models is difficult or impossible", true, "Once thousands of devices are installed in the field, changing their model is hard. That is why the last part of the lecture asks what happens when things change."],
          ["Models can be retrained often and deployed instantly", false, "That is the cloud."],
        ],
      },
      {
        q: "What does the slide mean by 'embedded ML is not just ML'?",
        options: [
          ["It has to include the whole pipeline: sensors, preprocessing, the model, post-processing and decisions, actuators, and the hardware it all runs on", true, "The model is only the orange box in the middle of the slide's pipeline."],
          ["Embedded ML does not use machine learning", false, "It does: the ML algorithm sits at the centre of the pipeline."],
          ["Embedded ML only runs on GPUs", false, "It runs on all sorts of hardware, mostly MCUs and small accelerators."],
          ["Embedded ML needs no software", false, "Most of the slide's pipeline is software."],
        ],
      },
    ],

    requirements: [
      {
        q: "In the slide's requirement chain, what limits how many parameters a model may have?",
        options: [
          ["The number of end users", false, "Users drive cost and volume, not the model size directly."],
          ["Only the size of the training dataset", false, "The dataset influences what can be learned, but the slide's limit is whether the weights fit in memory."],
          ["Nothing, any model fits", false, "On an MCU with a few hundred kB of memory, far from it."],
          ["The memory on the device, which in turn follows from the application requirements", true, "Application requirements (latency, cost, energy, accuracy) define the device, and the device defines the algorithm: how many operations and parameters it can afford."],
        ],
      },
      {
        q: "A model needs 2 million MACs per inference and the processor does 40 million MACs per second. Can it meet a 30 ms latency budget?",
        options: [
          ["Yes, one inference takes 20 ms", false, "20 is 40 / 2, the inverted ratio. Time is work divided by speed: 2 M / 40 M per second."],
          ["No, one inference takes 50 ms", true, "2,000,000 / 40,000,000 per second = 0.05 s = 50 ms, which is over the 30 ms budget."],
          ["Yes, one inference takes 0.05 ms", false, "0.05 is in seconds, not milliseconds."],
          ["Latency depends only on accuracy", false, "Latency depends on how many operations the model needs and how fast the hardware executes them."],
        ],
      },
    ],

    hardware: [
      {
        q: "Which platform does the slide describe as low frequency, low power, with built-in memory and peripherals (e.g. ARM Cortex-M, RISC-V, ESP32)?",
        options: [
          ["Microprocessor (CPU/MPU)", false, "MPUs are high-frequency, multi-core, with cache hierarchies (x86, ARM Cortex-A)."],
          ["Graphics processing unit (GPU)", false, "GPUs offer massive parallelism and bandwidth (NVIDIA Jetson, Adreno)."],
          ["Microcontroller (MCU)", true, "The MCU is the workhorse of wearables, IoT and industrial automation."],
          ["Neural processing unit (NPU)", false, "NPUs are specialised accelerators with low-precision math and static graph execution."],
        ],
      },
      {
        q: "When is an FPGA a natural choice, according to the slide?",
        options: [
          ["For a single-purpose chip made in large volumes", false, "That is an ASIC: like an FPGA, but for large volumes."],
          ["For prototyping or low-volume domain-specific tasks, thanks to its reconfigurable logic", true, "An FPGA can be rewired after manufacturing, which suits prototypes and small series."],
          ["For audio processing with SIMD instructions and hardware loops", false, "That describes a DSP."],
          ["For processing, memory, storage and connectivity on one die", false, "That describes a system-on-chip (SoC)."],
        ],
      },
    ],

    accelerators: [
      {
        q: "Which operation do neural networks mostly boil down to?",
        options: [
          ["Conditional branches", false, "Neural networks are static graphs with almost no branching."],
          ["String processing", false, "Not a neural network operation."],
          ["Division", false, "Divisions are rare in neural network inference."],
          ["Multiply-accumulate (MAC)", true, "Every weighted sum is a chain of 'multiply an input by a weight and add it to the total'. NPUs are built around MAC arrays."],
        ],
      },
      {
        q: "Why can an NPU leave out most of the control-flow hardware a CPU has?",
        options: [
          ["Neural networks are pre-determined, static computational graphs: no conditional branching and fixed-length loops", true, "The sequence of operations is known in advance, so there is no need for branch prediction or out-of-order execution."],
          ["Because NPUs run a full operating system", false, "NPUs are fixed-function accelerators; the host processor runs the software."],
          ["Because the weights change every clock cycle", false, "Weights are fixed during inference, and reused many times."],
          ["Because NPUs use 64-bit floating point", false, "NPUs favour low precision, INT8 or less."],
        ],
      },
    ],

    ethos: [
      {
        q: "In the Arm Ethos-U microNPU case study, who requests an inference job?",
        options: [
          ["The DMA", false, "The DMA moves the data streams (commands, input, output, weights) once a job has been requested."],
          ["The MAC engine", false, "The MAC engine computes the dot products; it does not start jobs."],
          ["The host MCU", true, "The Cortex-M host asks for an inference; the NPU's control unit then parses the command stream and orchestrates the work."],
          ["The system SRAM", false, "SRAM is memory; it holds data but does not request anything."],
        ],
      },
      {
        q: "Why does the Ethos-U keep the current layer's weights and partial results in its local memory?",
        options: [
          ["To make the chip larger", false, "Local memory costs area; it is there because it saves something more important."],
          ["Because the MCU's flash cannot store weights", false, "The weights are stored in system flash; local memory is a working copy close to the compute units."],
          ["Because local memory is slower", false, "It is used because it is closer and cheaper to reach than external memory."],
          ["To minimise data movement, which costs time and energy", true, "Inputs and weights are used many times; keeping them next to the MAC engine avoids fetching them again and again. 'Minimal data movement' is one of the NPU design priorities."],
        ],
      },
    ],

    workflow: [
      {
        q: "In the TinyML workflow, which step comes right after 'Evaluate / optimize'?",
        options: [
          ["Convert model", true, "The order is: collect data, pre-process data, design model, train a model, evaluate and optimise, convert model, deploy model, make inference."],
          ["Deploy model", false, "Deployment comes after the model has been converted into a format the target can run."],
          ["Collect data", false, "Data collection is the first step."],
          ["Train a model", false, "Training comes before evaluation."],
        ],
      },
      {
        q: "Which part of the AI infrastructure covers collecting and pre-processing the data?",
        options: [
          ["Model engineering", false, "Model engineering is designing and training the model."],
          ["Data engineering", true, "The colours on the slide match: the first two workflow steps are data engineering."],
          ["Model deployment", false, "Deployment covers converting and deploying the model."],
          ["Product analytics", false, "Product analytics is about how the deployed product performs."],
        ],
      },
    ],

    "data-collection": [
      {
        q: "A cat detector is trained only on well-lit, front-facing cat photos. What is likely to happen after deployment?",
        options: [
          ["It works equally well in every situation", false, "It only learned what was in its dataset."],
          ["It refuses to run in the dark", false, "It will run; it will just make more mistakes."],
          ["It performs poorly on dark, occluded or unusual views, because it performs well on what is well represented in the dataset", true, "The slide's rule: think about the situations the system will meet after deployment (illumination, viewpoint, occlusion, deformation, different-looking cats) and collect those."],
          ["It becomes a dog detector", false, "It only knows the classes it was trained on."],
        ],
      },
      {
        q: "What does the slide say about labelling the data?",
        options: [
          ["It is optional for deep learning", false, "Supervised learning needs labels for every training example."],
          ["It is fully automatic", false, "The previous part of the lecture already noted that labelling is mostly manual."],
          ["It only matters for regression", false, "Classification needs labels just as much."],
          ["It is equally important as collecting the data, if not more, and bothersome", true, "A wrong label teaches the model the wrong thing, and someone has to produce every label."],
        ],
      },
    ],

    preprocessing: [
      {
        q: "What is the objective of the preprocessing step?",
        options: [
          ["Make it easier for the ML algorithm to learn the patterns, and be more accurate during inference", true, "That is the slide's definition. It can mean feeding raw data, extracting statistical features, or using part of another pre-trained network."],
          ["Make the dataset larger", false, "Preprocessing transforms the data; it does not create new examples."],
          ["Replace the model", false, "Preprocessing feeds the model; it does not replace it."],
          ["Encrypt the data", false, "Security is a separate concern."],
        ],
      },
      {
        q: "Which is an example of hand-selected feature extraction from the slide?",
        options: [
          ["Feeding the raw samples straight into the network", false, "That is the first option on the slide, without any feature extraction."],
          ["Computing the mean, variance and peak-to-peak distance of a window of sensor data", true, "A human chose these statistics, and the network then works on a few numbers instead of every sample. The lab shows how well variance separates idle from moving."],
          ["Using part of a pre-trained neural network", false, "That is the third option: learned features, not hand-selected ones."],
          ["Quantizing the weights", false, "Quantization is a model optimisation step, later in the workflow."],
        ],
      },
    ],

    "design-train": [
      {
        q: "Which of these is a model design question rather than a training question on the slide?",
        options: [
          ["When should the training stop?", false, "That is one of the slide's training questions."],
          ["Where should the training run?", false, "That is one of the slide's training questions (PC, local server, data centre)."],
          ["Which activation functions should I use?", true, "Layers, neurons per layer, activation functions, evaluation metric and loss function are design choices."],
          ["Which other hyperparameters should the training use?", false, "That is one of the slide's training questions."],
        ],
      },
      {
        q: "What is a hyperparameter?",
        options: [
          ["A weight that is larger than 1", false, "Weights are learned parameters, whatever their size."],
          ["The output of the last layer", false, "That is the prediction."],
          ["A parameter of the dataset", false, "Hyperparameters belong to the model and its training, not to the data."],
          ["A setting chosen before training, such as the learning rate or the number of layers, rather than learned from data", true, "Weights and biases are learned by training; hyperparameters are chosen by the designer and control how that learning happens."],
        ],
      },
    ],

    evaluation: [
      {
        q: "Predictions Y = (2, 4, 7) and targets T = (3, 4, 5). What is the mean absolute error?",
        options: [
          ["1", true, "|2 - 3| + |4 - 4| + |7 - 5| = 1 + 0 + 2 = 3, divided by N = 3 samples gives MAE = 1."],
          ["3", false, "3 is the sum of the absolute errors. The mean divides by N = 3."],
          ["0.33", false, "Recheck the absolute errors: they are 1, 0 and 2, not 1, 0 and 0."],
          ["1.67", false, "That is (1 + 0 + 4) / 3, the mean squared error. MAE uses the absolute values."],
        ],
      },
      {
        q: "A keyword classifier gets 45 of 50 test samples right. What is its accuracy?",
        options: [
          ["45%", false, "45 is the count of correct answers, not a percentage."],
          ["90%", true, "Accuracy = (1/N) Σ (Yn == Tn) = 45 / 50 = 0.9."],
          ["10%", false, "10% is the error rate: 5 wrong out of 50."],
          ["95%", false, "That would be 47.5 correct out of 50."],
        ],
      },
      {
        q: "Why must the evaluation use test data that was not used for training?",
        options: [
          ["Because test data is always larger", false, "Test sets are usually smaller than training sets."],
          ["Because training data is too noisy", false, "Noise is not the reason. The point is that the model has already seen the training data."],
          ["Because the loss function cannot be computed on training data", false, "It can, and it is: training minimises it."],
          ["A model can fit its training data very well and still fail on new data; only unseen data shows how it will do after deployment", true, "The overfitting lab shows it: a high-degree fit has almost zero training error and a large error on new samples."],
        ],
      },
    ],

    compression: [
      {
        q: "Which compression technique reduces the numerical resolution of the weights?",
        options: [
          ["Quantization", true, "Quantization (and its extreme, binarization) is in the 'resolution' family: fewer bits per number."],
          ["Pruning", false, "Pruning removes weights or structures, reducing complexity."],
          ["Knowledge distillation", false, "Distillation trains a smaller student network, changing the topology."],
          ["Neural architecture search", false, "NAS searches for a different, efficient topology."],
        ],
      },
      {
        q: "In the slide's taxonomy, which family does pruning belong to?",
        options: [
          ["Resolution", false, "Resolution covers quantization and binarization."],
          ["Topology", false, "Topology covers knowledge distillation and neural architecture search."],
          ["Deployment", false, "Deployment is a later workflow step, not a compression family."],
          ["Complexity", true, "Pruning (unstructured or structured) and low-rank approximation reduce the model's complexity."],
        ],
      },
    ],

    quantization: [
      {
        q: "The slide maps float values from -5.4 to +4.5 onto 8 bits (0 to 255). About how large is the scale, (max - min) / 255?",
        options: [
          ["About 9.9", false, "9.9 is the width of the range. It is shared out over 255 steps."],
          ["About 0.021", false, "That divides only 5.4 by 255. The range is 4.5 - (-5.4) = 9.9."],
          ["About 2.0", false, "With such a large step, 8 bits would cover over 500 units."],
          ["About 0.039", true, "9.9 / 255 = 0.0388: each integer step stands for about 0.039 in float terms."],
        ],
      },
      {
        q: "With q = round(x / scale) + zero_point, scale = 0.0388 and zero_point = 139, which integer does x = 0.0 get?",
        options: [
          ["139", true, "round(0 / 0.0388) + 139 = 139. The zero point is exactly the integer that represents 0.0."],
          ["0", false, "0 represents the minimum, -5.4: round(-5.4 / 0.0388) + 139 = -139 + 139 = 0."],
          ["128", false, "128 would be the middle of 0 to 255, but this range is not symmetric around 0."],
          ["255", false, "255 represents the maximum, +4.5."],
        ],
      },
      {
        q: "A value was quantized to q = 141 (scale 0.0388, zero point 139). What does de-quantization return?",
        options: [
          ["141", false, "141 is the integer code. De-quantization turns it back into a float."],
          ["About 0.078", true, "x = (q - zero_point) × scale = (141 - 139) × 0.0388 = 0.0776."],
          ["About 5.47", false, "That multiplies q by the scale without subtracting the zero point first."],
          ["Exactly the original value", false, "Rounding threw away the detail below one step, so the result is only within ±scale/2 of the original."],
        ],
      },
    ],

    "why-quantize": [
      {
        q: "A model has 250,000 float32 weights. Roughly how much storage does quantizing them to int8 save?",
        options: [
          ["About 250 kB", false, "250 kB is what remains after quantization, not what is saved."],
          ["Nothing, the number of weights is the same", false, "The count stays the same, but each weight shrinks from 4 bytes to 1."],
          ["About 750 kB: 1 MB of weights becomes 250 kB", true, "250,000 × 4 B = 1 MB in float32, 250,000 × 1 B = 250 kB in int8: the slide's ≈4x reduction."],
          ["About 4 MB", false, "That is 16 bytes per weight; float32 is 4 bytes."],
        ],
      },
      {
        q: "Which of these is NOT one of the slide's reasons to quantize?",
        options: [
          ["Portability: every device can do 8-bit integer arithmetic", false, "That is on the slide: not every device can do 32-bit floating point."],
          ["Energy saving: 8-bit operations need much less energy", false, "That is on the slide."],
          ["Inference latency: integer arithmetic is faster, roughly 2 to 4x", false, "That is on the slide."],
          ["It always improves accuracy", true, "Accuracy usually drops slightly. The next slide shows this accuracy-latency trade-off; the loss is usually small compared with the gains."],
        ],
      },
    ],

    "ptq-qat": [
      {
        q: "Which approach needs no labelled data and no training steps?",
        options: [
          ["Quantization-aware training (QAT)", false, "QAT retrains the quantized model on training data."],
          ["Post-training quantization (PTQ)", true, "PTQ takes the pre-trained model and only needs calibration data (no labels) to set the quantization parameters."],
          ["Both of them", false, "QAT needs training data and training steps."],
          ["Neither of them", false, "PTQ needs neither labels nor training."],
        ],
      },
      {
        q: "When is quantization-aware training worth its extra effort?",
        options: [
          ["When no training data is available", false, "QAT needs training data. Without it, PTQ is the only option."],
          ["When the model is already float16", false, "The starting precision is not what decides it."],
          ["At low bit-widths, where simulating quantization during training recovers accuracy", true, "QAT lets the weights adapt to the rounding. The slide: more effective at low bit-widths."],
          ["Never, PTQ is always better", false, "PTQ is simpler, but QAT wins when accuracy suffers at low precision."],
        ],
      },
    ],

    deploy: [
      {
        q: "Which problem do model exchange formats such as ONNX and TFLite address?",
        options: [
          ["Models are too accurate", false, "Accuracy is not the issue at this step."],
          ["Training is too slow", false, "Conversion happens after training."],
          ["Datasets are too small", false, "Data collection is the first step of the workflow, not this one."],
          ["Different hardware targets (MCUs, SoCs, FPGAs) need different representations and compilation flows", true, "A common exchange format sits between the training framework and the many target-specific tools."],
        ],
      },
      {
        q: "How does an inference engine such as TFLite Micro (TFLM) run a model?",
        options: [
          ["It converts the model to an internal representation offline and executes it with a runtime integrated into the firmware", true, "That is the most popular approach. Compilers and code generators (TVM, onnx2c...) instead generate native code; most tools mix both."],
          ["It generates native C code that runs with no runtime at all", false, "That describes compilers and code generators."],
          ["It sends every input to the cloud", false, "The model runs on the device."],
          ["It retrains the model on the device", false, "An inference engine runs a trained model; it does not train it."],
        ],
      },
    ],

    "metrics-embedded": [
      {
        q: "Which metric is the working memory needed for inference, including the parameters and the intermediate activations?",
        options: [
          ["Model size", false, "Model size counts only the parameters (count × precision)."],
          ["Memory footprint", true, "The footprint adds the activations that must be held while the inference runs."],
          ["Throughput", false, "Throughput is data processed per unit of time, such as frames per second."],
          ["Operations", false, "Operations (FLOPs, MACs) count the work, not the memory."],
        ],
      },
      {
        q: "One inference takes 20 ms on a processor drawing 15 mW. How much energy does it use?",
        options: [
          ["0.75 µJ", false, "15 / 20 divides power by time. Energy is power multiplied by time."],
          ["300 mJ", false, "Check the units: 15 mW × 0.02 s = 0.3 mJ, not 300 mJ."],
          ["300 µJ", true, "E = P × t = 0.015 W × 0.020 s = 0.0003 J = 300 µJ."],
          ["3 µJ", false, "This is off by a factor of 100. 15 mW × 20 ms = 300 µJ."],
        ],
      },
    ],

    "distribution-shift": [
      {
        q: "What problem with the standard TinyML framework does the slide describe?",
        options: [
          ["The model is too large for the device", false, "That is a compression problem. This slide is about the data."],
          ["The data seen during inference comes from a different distribution P¹ than the training data from P", true, "The model learned P, but after deployment it faces P¹. The two can differ in statistics the model relies on."],
          ["The model cannot be converted to TFLite", false, "Conversion is not the issue here."],
          ["The labels are encrypted", false, "Not on the slide."],
        ],
      },
      {
        q: "Which is one of the slide's examples of this problem?",
        options: [
          ["The radio range is too short", false, "Not a data distribution problem."],
          ["The battery is too small", false, "Not a data distribution problem."],
          ["The training data comes from a few machines or users, but the algorithm has to work on many", true, "The other examples: the task needs the characteristics of one specific machine or user, and data distributions change over time."],
          ["The model was trained with too many epochs", false, "That might cause overfitting, but the slide's problem is a change between training and deployment data."],
        ],
      },
    ],

    odl: [
      {
        q: "What is on-device learning (ODL)?",
        options: [
          ["Running inference on the device, with the model trained elsewhere", false, "That is standard TinyML. ODL moves (part of) the learning itself onto the device."],
          ["Training in the cloud and downloading the result", false, "That is the conventional workflow."],
          ["A branch of TinyML that runs at least part of the learning phase on devices constrained in energy, memory and computation", true, "That is the slide's definition: the overlap of TinyML and model learning."],
          ["Updating the device's firmware over the air", false, "A firmware update replaces software; it does not learn from data."],
        ],
      },
      {
        q: "Which benefit does the slide list for on-device learning?",
        options: [
          ["It removes the need for any training data", false, "It learns from data collected on the device, so data is still needed."],
          ["It makes models larger", false, "Not a listed benefit, and memory is a constraint."],
          ["It removes all energy limits", false, "Energy is one of ODL's challenges."],
          ["Enabling otherwise impossible tasks, by learning on data available only on the device", true, "Also listed: improved accuracy by learning on device data too, and improved efficiency by learning only on device data."],
        ],
      },
    ],

    adaptation: [
      {
        q: "A device collects a few pictures of its owner's bottle at start-up and learns to recognise 'my bottle'. Which ODL task is this?",
        options: [
          ["Single-change adaptation", true, "Collect data of the specific user or object on start-up, learn once, then run inference."],
          ["Continuous adaptation", false, "Continuous adaptation keeps updating while data changes over time. Recognising a new bottle later would be continuous."],
          ["Post-training quantization", false, "PTQ compresses a model; it does not learn a new object."],
          ["Cloud retraining", false, "Everything happens on the device."],
        ],
      },
      {
        q: "A pressure sensor's offset drifts slowly over ten years. Which ODL task fits?",
        options: [
          ["Single-change adaptation at installation", false, "One calibration at installation is soon outdated: the drift keeps going."],
          ["No adaptation, the factory calibration is enough", false, "The drift grows over the years, so the error grows too."],
          ["Feature reduction", false, "Not an ODL task."],
          ["Continuous adaptation", true, "Start from a model, keep collecting new data and keep updating it. This is the slide's 'Pressure Sensor Drift' example."],
        ],
      },
    ],

    "odl-challenges": [
      {
        q: "Why is 'few data' a challenge for on-device learning?",
        options: [
          ["The device has only a small amount of memory to store training samples", true, "The slide: few data, because there is only a small amount of memory to store them. Choosing which data are relevant then matters even more."],
          ["Sensors cannot produce enough samples", false, "Sensors produce plenty. Keeping them is the problem."],
          ["Neural networks need exactly one sample", false, "Learning generally benefits from many samples."],
          ["The cloud deletes them", false, "ODL data stays on the device."],
        ],
      },
      {
        q: "Which ODL challenge is about trusting the result of learning?",
        options: [
          ["Limited computation", false, "That limits what can be learned, not how far the result can be trusted."],
          ["Little to no supervision on the learned model", true, "Nobody checks each update in the field, so a bad update could go unnoticed."],
          ["Few labels", false, "Few labels limit the learning signal; the trust issue is the missing supervision afterwards."],
          ["Energy limits", false, "Energy limits how much learning is affordable."],
        ],
      },
    ],

    tinysv: [
      {
        q: "In TinySV, Rose (not enrolled) says the keyword 'Hi Sheila!'. What does the system output?",
        options: [
          ["0: keyword not detected", false, "0 is for other words: the keyword was not said."],
          ["2: keyword pronounced by the enrolled speaker", false, "2 is for Bob, the enrolled speaker SE."],
          ["Nothing, it ignores unknown speakers", false, "It explicitly reports the keyword spoken by a non-enrolled speaker."],
          ["1: keyword detected, pronounced by a non-enrolled speaker", true, "The three outputs are: 0 keyword not detected, 1 keyword by a non-enrolled speaker SNE, 2 keyword by the enrolled speaker SE."],
        ],
      },
      {
        q: "Why is TinySV a single-change adaptation task?",
        options: [
          ["It updates its model after every keyword", false, "That would be continuous adaptation."],
          ["It is trained only in the cloud", false, "The enrolment, the learning step, happens on the device."],
          ["The enrolled speaker's voice is learned once, on the device, in an enrolment phase, and then used for inference", true, "A personalisation task: collect the user's data at start-up, learn, then execute inference, as on the single-change slide."],
          ["It never needs any data from the user", false, "Enrolment needs recordings of the user's voice."],
        ],
      },
    ],
  };

  /* =====================================================================
     Shared helpers
     ===================================================================== */
  // log-slider value snapped to 2 significant digits, so the shown and the used value agree
  const nice = (e) => { const v = Math.pow(10, e); const p = Math.pow(10, Math.floor(Math.log10(v)) - 1); return Math.round(v / p) * p; };
  const fmtNum = (n) => Math.round(n).toLocaleString("en-US");
  function fmtBytes(b) {
    if (b >= 1e12) return (b / 1e12).toFixed(2) + " TB";
    if (b >= 1e9) return (b / 1e9).toFixed(2) + " GB";
    if (b >= 1e6) return (b / 1e6).toFixed(2) + " MB";
    if (b >= 1e3) return (b / 1e3).toFixed(1) + " kB";
    return Math.round(b) + " B";
  }
  function fmtBits(bps) {
    if (bps >= 1e9) return (bps / 1e9).toFixed(2) + " Gbit/s";
    if (bps >= 1e6) return (bps / 1e6).toFixed(2) + " Mbit/s";
    if (bps >= 1e3) return (bps / 1e3).toFixed(1) + " kbit/s";
    return bps.toFixed(bps < 10 ? 2 : 0) + " bit/s";
  }
  function fmtTime(s) {
    if (s >= 1) return s.toFixed(2) + " s";
    if (s >= 1e-3) return (s * 1e3).toFixed(s >= 0.1 ? 0 : 1) + " ms";
    return (s * 1e6).toFixed(0) + " µs";
  }
  function fmtEnergy(j) {
    if (j >= 1) return j.toFixed(2) + " J";
    if (j >= 1e-3) return (j * 1e3).toFixed(2) + " mJ";
    return (j * 1e6).toFixed(1) + " µJ";
  }
  function fmtPower(w) {
    if (w >= 1) return w.toFixed(2) + " W";
    if (w >= 1e-3) return (w * 1e3).toFixed(2) + " mW";
    return (w * 1e6).toFixed(1) + " µW";
  }
  function fmtDuration(hours) {
    if (!isFinite(hours)) return "unlimited";
    if (hours >= 24 * 365) return (hours / (24 * 365)).toFixed(1) + " years";
    if (hours >= 48) return (hours / 24).toFixed(0) + " days";
    return hours.toFixed(1) + " hours";
  }
  function setVerdict(el, tone, html) { el.className = "verdict" + (tone ? " " + tone : ""); el.innerHTML = html; }
  function btn(text, onclick, cls) { return h("button", { type: "button", class: "btn" + (cls ? " " + cls : ""), html: text, onclick }); }
  function mean(a) { return a.reduce((s, x) => s + x, 0) / a.length; }

  /* =====================================================================
     LAB: BLERP, raw streaming vs on-device decisions
     ===================================================================== */
  function labBlerp(el) {
    const { controls, view } = NES.lab(el, {
      title: "Stream raw data, or decide on the device?",
      hint: "Illustrative numbers. Either every device streams its raw samples to the cloud, or it runs the model itself and only sends a 50-byte event message when something happens. The cloud model itself is assumed to take 10 ms.",
    });
    const SENSORS = {
      audio: { label: "Microphone: 16 kHz, 16-bit", bps: 16000 * 2 },
      imu: { label: "Accelerometer: 100 Hz, 3 axes, 16-bit", bps: 100 * 3 * 2 },
      camera: { label: "Camera: 96 × 96 grey, 5 fps", bps: 96 * 96 * 5 },
    };
    const devices = NES.slider(controls, { label: "Number of devices", min: 0, max: 5, step: 0.05, value: 3, map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtNum(v) });
    const sensor = NES.seg(controls, { label: "Sensor", options: [["audio", "Audio"], ["imu", "Motion"], ["camera", "Camera"]], value: "audio" });
    const events = NES.slider(controls, { label: "Events per hour (on-device)", min: 0, max: 60, step: 1, value: 4, fmt: (v) => v + " /h" });
    const rtt = NES.slider(controls, { label: "Network round trip", min: 20, max: 1000, step: 10, value: 150, fmt: (v) => v + " ms" });
    const local = NES.slider(controls, { label: "On-device inference", min: 1, max: 500, step: 1, value: 40, fmt: (v) => v + " ms" });

    const table = h("div", { class: "table-wrap" });
    const verdict = h("div", { class: "verdict" });
    view.append(h("div", { class: "stage" }, [table]));
    const stats = NES.stats(view, [
      { key: "fleet", label: "Fleet upload, raw" },
      { key: "day", label: "Raw data per day" },
      { key: "edge", label: "Fleet upload, events only" },
      { key: "factor", label: "Less data to send" },
    ]);
    view.append(verdict);

    function update() {
      const s = SENSORS[sensor.value];
      const n = devices.value;
      const rawPerDevice = s.bps * 8; // bit/s
      const fleetRaw = rawPerDevice * n;
      const rawDay = s.bps * 86400 * n; // bytes
      const evDay = events.value * 24 * 50 * n; // bytes
      const evRate = (evDay * 8) / 86400;
      const cloudMs = rtt.value + 10, edgeMs = local.value;
      table.innerHTML =
        `<table class="tt"><thead><tr><th></th><th>Stream to the cloud</th><th class="out">Decide on the device</th></tr></thead><tbody>` +
        `<tr><td style="text-align:left">Sends</td><td>${s.label}</td><td class="out">${events.value} events/h × 50 B</td></tr>` +
        `<tr><td style="text-align:left">Per device</td><td>${fmtBits(rawPerDevice)}</td><td class="out">${fmtBits(evRate / n)}</td></tr>` +
        `<tr><td style="text-align:left">Response time</td><td class="${cloudMs > edgeMs ? "v-bad" : ""}">${cloudMs} ms</td><td class="out ${edgeMs > cloudMs ? "v-bad" : ""}">${edgeMs} ms</td></tr>` +
        `<tr><td style="text-align:left">Raw data leaves the device</td><td class="v-bad">yes</td><td class="out">no</td></tr>` +
        `<tr><td style="text-align:left">Works without network</td><td class="v-bad">no</td><td class="out">yes (alerts queue)</td></tr>` +
        `</tbody></table>`;
      stats.set("fleet", fmtBits(fleetRaw), fleetRaw > 1e8 ? "bad" : fleetRaw > 1e6 ? "warn" : "");
      stats.set("day", fmtBytes(rawDay));
      stats.set("edge", fmtBits(evRate), "good");
      stats.set("factor", evDay > 0 ? fmtNum(rawDay / evDay) + "×" : "all of it", "good");
      const faster = edgeMs < cloudMs;
      setVerdict(verdict, faster ? "good" : "warn",
        "<b>B</b>andwidth: " + fmtBits(fleetRaw) + " of raw data shrinks to " + fmtBits(evRate) + ". " +
        "<b>L</b>atency: " + (faster ? "the device answers " + (cloudMs - edgeMs) + " ms sooner." : "here the slow on-device model loses to the cloud, so latency alone would not justify it.") + " " +
        "<b>E</b>conomics: less traffic and cloud processing to pay for. <b>R</b>eliability: no dependency on the network. <b>P</b>rivacy: the raw recordings never leave the device.");
    }
    [devices, sensor, events, rtt, local].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: the slide's braking rule (conditional logic)
     ===================================================================== */
  function labRule(el) {
    const { controls, view } = NES.lab(el, {
      title: "The slide's braking rule, live",
      hint: "This is the conditional-logic program from the slide. It is deterministic and needs no training data, but somebody had to know the physics to write it.",
    });
    const speed = NES.slider(controls, { label: "current_speed", min: 1, max: 40, step: 0.5, value: 10, fmt: (v) => v + " m/s" });
    const dist = NES.slider(controls, { label: "distance_from_wall", min: 1, max: 200, step: 1, value: 50, fmt: (v) => v + " m" });
    const stop = NES.slider(controls, { label: "seconds_to_stop", min: 1, max: 8, step: 0.5, value: 3, fmt: (v) => v + " s" });
    const buf = NES.slider(controls, { label: "safety_buffer", min: 0, max: 4, step: 0.5, value: 1, fmt: (v) => v + " s" });
    const code = h("pre", { class: "ea-code", "aria-label": "Braking rule code" });
    const meter = h("div", { class: "meter" });
    view.append(code, h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "t", label: "seconds_until_crash" }, { key: "lim", label: "seconds_to_stop + safety_buffer" }, { key: "dec", label: "applyBrakes()" }]);

    function update() {
      const t = dist.value / speed.value, lim = stop.value + buf.value, brake = t < lim;
      const n = (v) => String(v);
      code.innerHTML =
        `current_speed = ${n(speed.value)}        <span class="c"># In meters per second</span>\n` +
        `distance_from_wall = ${n(dist.value)}    <span class="c"># In meters</span>\n` +
        `seconds_to_stop = ${n(stop.value)}       <span class="c"># Minimum time to stop the car</span>\n` +
        `safety_buffer = ${n(buf.value)}          <span class="c"># Safety margin in seconds</span>\n\n` +
        `seconds_until_crash = distance_from_wall / current_speed   <span class="c"># = ${t.toFixed(2)}</span>\n\n` +
        `<span class="${brake ? "hl-yes" : "hl-no"}">if (seconds_until_crash &lt; seconds_to_stop + safety_buffer):   <span class="c"># ${t.toFixed(2)} &lt; ${lim.toFixed(1)} is ${brake ? "True" : "False"}</span></span>\n` +
        `    applyBrakes();\n}`;
      const max = Math.max(t, lim) * 1.15;
      meter.innerHTML =
        `<div class="meter-row"><span class="m-label">Until crash</span><div class="meter-track"><div class="meter-fill" style="width:${(t / max) * 100}%;background:var(--${brake ? "bad" : "ok"})"></div><span class="meter-mark" style="left:${(lim / max) * 100}%"></span></div><span class="m-val">${t.toFixed(2)} s</span></div>` +
        `<div class="meter-row"><span></span><span class="lab-hint" style="margin:0;font-size:12px">the mark is seconds_to_stop + safety_buffer = ${lim.toFixed(1)} s</span><span></span></div>`;
      stats.set("t", t.toFixed(2) + " s");
      stats.set("lim", lim.toFixed(1) + " s");
      stats.set("dec", brake ? "BRAKE" : "not called", brake ? "bad" : "good");
    }
    [speed, dist, stop, buf].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: underfitting and overfitting (polynomial least squares)
     ===================================================================== */
  function lstsq(A, b) {
    const m = A.length, n = A[0].length;
    const R = A.map((r) => r.slice()), y = b.slice();
    for (let k = 0; k < n; k++) {
      let norm = 0;
      for (let i = k; i < m; i++) norm += R[i][k] * R[i][k];
      norm = Math.sqrt(norm);
      if (norm < 1e-14) continue;
      const alpha = R[k][k] > 0 ? -norm : norm;
      const v = new Array(m).fill(0);
      for (let i = k; i < m; i++) v[i] = R[i][k];
      v[k] -= alpha;
      let vv = 0;
      for (let i = k; i < m; i++) vv += v[i] * v[i];
      if (vv < 1e-300) continue;
      for (let j = k; j < n; j++) {
        let s = 0;
        for (let i = k; i < m; i++) s += v[i] * R[i][j];
        s = (2 * s) / vv;
        for (let i = k; i < m; i++) R[i][j] -= s * v[i];
      }
      let s = 0;
      for (let i = k; i < m; i++) s += v[i] * y[i];
      s = (2 * s) / vv;
      for (let i = k; i < m; i++) y[i] -= s * v[i];
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let s = y[i];
      for (let j = i + 1; j < n; j++) s -= R[i][j] * x[j];
      x[i] = Math.abs(R[i][i]) < 1e-12 ? 0 : s / R[i][i];
    }
    return x;
  }
  function polyFit(xs, ys, deg) {
    const A = xs.map((x) => { const t = 2 * x - 1; const row = []; let p = 1; for (let k = 0; k <= deg; k++) { row.push(p); p *= t; } return row; });
    const c = lstsq(A, ys);
    return (x) => { const t = 2 * x - 1; let p = 1, s = 0; for (let k = 0; k <= deg; k++) { s += c[k] * p; p *= t; } return s; };
  }

  function labOverfit(el) {
    const { controls, view } = NES.lab(el, {
      title: "The simplest model that explains past and future data",
      hint: "Twelve training samples (filled dots) and forty new samples (rings) come from the same process: y = sin(2πx) plus noise. Fit a polynomial of growing degree and compare its error on the data it learned from with its error on data it has never seen.",
    });
    const deg = NES.slider(controls, { label: "Model complexity (degree)", min: 0, max: 11, step: 1, value: 3, fmt: (v) => String(v) });
    const noise = NES.slider(controls, { label: "Noise in the process", min: 0, max: 0.5, step: 0.01, value: 0.2, fmt: (v) => "σ = " + v.toFixed(2) });
    controls.append(h("div", { class: "btn-row" }, [btn("New samples", () => { seed += 1; regen(); update(); })]));
    const cv = h("canvas", { style: "height:240px", "aria-label": "Training and test samples with the fitted curve" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--tech);height:8px;width:8px;border-radius:50%"></i>training sample</span><span><i style="border:2px solid var(--hi);background:none;height:8px;width:8px;border-radius:50%"></i>new (test) sample</span><span><i style="background:var(--accent)"></i>fitted model</span><span><i class="dash" style="color:var(--muted)"></i>true process</span>` }));
    const stats = NES.stats(view, [{ key: "p", label: "Parameters" }, { key: "tr", label: "Training MAE" }, { key: "te", label: "Test MAE" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);

    let seed = 11, train = [], test = [];
    function regen() {
      const r = NES.rng(seed);
      const g = () => NES.gauss(r);
      train = Array.from({ length: 12 }, (_, i) => ({ x: (i + 0.15 + 0.7 * r()) / 12, n: g() }));
      test = Array.from({ length: 40 }, () => ({ x: r(), n: g() }));
    }
    regen();
    const truth = (x) => Math.sin(2 * Math.PI * x);
    let model = null, trMae = 0, teMae = 0;
    function compute() {
      const s = noise.value;
      const ys = train.map((p) => truth(p.x) + s * p.n);
      model = polyFit(train.map((p) => p.x), ys, Math.round(deg.value));
      trMae = mean(train.map((p, i) => Math.abs(model(p.x) - ys[i])));
      teMae = mean(test.map((p) => Math.abs(model(p.x) - (truth(p.x) + s * p.n))));
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      if (!model) compute();
      const s = noise.value, padL = 30, padR = 8, padT = 10, padB = 18;
      const X = (x) => padL + x * (w - padL - padR);
      const Y = (y) => padT + (1 - (NES.clamp(y, -2.2, 2.2) + 2.2) / 4.4) * (hh - padT - padB);
      ctx.font = "11px " + NES.css("--font");
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      [-2, -1, 0, 1, 2].forEach((v) => { ctx.beginPath(); ctx.moveTo(padL, Y(v)); ctx.lineTo(w - padR, Y(v)); ctx.stroke(); });
      ctx.fillStyle = NES.css("--muted");
      [-2, 0, 2].forEach((v) => ctx.fillText(String(v), 6, Y(v) + 4));
      ctx.fillText("x", w - padR - 8, hh - 4);
      // true process
      ctx.strokeStyle = NES.css("--muted"); ctx.setLineDash([4, 4]); ctx.beginPath();
      for (let px = 0; px <= w - padL - padR; px += 2) { const x = px / (w - padL - padR); px ? ctx.lineTo(X(x), Y(truth(x))) : ctx.moveTo(X(x), Y(truth(x))); }
      ctx.stroke(); ctx.setLineDash([]);
      // model
      ctx.save(); ctx.beginPath(); ctx.rect(padL, padT, w - padL - padR, hh - padT - padB); ctx.clip();
      ctx.strokeStyle = NES.css("--accent"); ctx.lineWidth = 2.2; ctx.beginPath();
      for (let px = 0; px <= w - padL - padR; px++) { const x = px / (w - padL - padR); const y = model(x); px ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y)); }
      ctx.stroke(); ctx.restore();
      // samples
      test.forEach((p) => { ctx.strokeStyle = NES.css("--hi"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(p.x), Y(truth(p.x) + s * p.n), 3.5, 0, Math.PI * 2); ctx.stroke(); });
      train.forEach((p) => { ctx.fillStyle = NES.css("--tech"); ctx.beginPath(); ctx.arc(X(p.x), Y(truth(p.x) + s * p.n), 4.5, 0, Math.PI * 2); ctx.fill(); });
    });
    function update() {
      compute();
      const d = Math.round(deg.value);
      stats.set("p", String(d + 1));
      stats.set("tr", trMae.toFixed(3));
      stats.set("te", teMae.toFixed(3), teMae > 2 * Math.max(trMae, 0.05) && d >= 6 ? "bad" : teMae < 0.3 + noise.value ? "good" : "warn");
      if (d <= 2) setVerdict(verdict, "warn", "<b>Too simple (underfitting).</b> The model cannot follow the shape of the process, so it is wrong on both old and new data.");
      else if (d >= 7 && teMae > 1.5 * trMae + 0.02) setVerdict(verdict, "bad", "<b>Too complex (overfitting).</b> The curve bends through the training samples, noise included, so the training error is small but new samples are predicted badly.");
      else setVerdict(verdict, "good", "<b>About right.</b> The model follows the process without chasing the noise: similar error on the training samples and on new ones. That is the 'simplest approximating model'.");
      draw();
    }
    [deg, noise].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: a single artificial neuron with two inputs
     ===================================================================== */
  function labNeuron(el) {
    const { controls, view } = NES.lab(el, {
      title: "One artificial neuron, two inputs",
      hint: "y = φ(w1·x1 + w2·x2 + b). The shading is the neuron's output over the input square; the line is where the weighted sum is 0, i.e. where it switches between class 0 and class 1. Classify every dot, then switch the data to XOR.",
    });
    const w1 = NES.slider(controls, { label: "w<sub>1</sub>", min: -4, max: 4, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) });
    const w2 = NES.slider(controls, { label: "w<sub>2</sub>", min: -4, max: 4, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) });
    const b = NES.slider(controls, { label: "bias b", min: -4, max: 4, step: 0.1, value: -0.5, fmt: (v) => v.toFixed(1) });
    const act = NES.seg(controls, { label: "Activation φ", options: [["step", "Step"], ["sigmoid", "Sigmoid"], ["relu", "ReLU"]], value: "sigmoid" });
    const data = NES.seg(controls, { label: "Data", options: [["and", "AND"], ["xor", "XOR"]], value: "and" });
    controls.append(h("div", { class: "btn-row" }, [btn("Train (perceptron rule)", train)]));
    controls.append(h("p", { class: "lab-hint", html: "Training uses the perceptron rule w ← w + 0.5·(t - y)·x for up to 100 passes over the data, and keeps the best weights it has seen." }));
    const cv = h("canvas", { style: "height:260px", "aria-label": "Neuron output over the input plane" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "acc", label: "Dots classified correctly" }, { key: "z", label: "Output at x = (1, 1)" }, { key: "eq", label: "Boundary" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);

    const r = NES.rng(5);
    const CORNERS = [[0.15, 0.15], [0.15, 0.85], [0.85, 0.15], [0.85, 0.85]];
    const pts = [];
    CORNERS.forEach((c, ci) => { for (let k = 0; k < 8; k++) pts.push({ x1: NES.clamp(c[0] + 0.07 * NES.gauss(r), 0.02, 0.98), x2: NES.clamp(c[1] + 0.07 * NES.gauss(r), 0.02, 0.98), c: ci }); });
    const label = (p) => (data.value === "and" ? (p.c === 3 ? 1 : 0) : p.c === 1 || p.c === 2 ? 1 : 0);
    const phi = (z) => (act.value === "step" ? (z >= 0 ? 1 : 0) : act.value === "sigmoid" ? 1 / (1 + Math.exp(-z)) : Math.max(0, z));
    const cls = (z) => (act.value === "relu" ? (z > 0 ? 1 : 0) : z >= 0 ? 1 : 0);
    const zf = (x1, x2) => w1.value * x1 + w2.value * x2 + b.value;

    function train() {
      let W1 = 0, W2 = 0, B = 0;
      const order = pts.map((_, i) => i);
      const rr = NES.rng(17);
      const score = (a, c, d) => pts.filter((p) => (a * p.x1 + c * p.x2 + d >= 0 ? 1 : 0) === label(p)).length;
      let best = [W1, W2, B], bestScore = score(W1, W2, B);
      for (let ep = 0; ep < 100; ep++) {
        for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        let errors = 0;
        order.forEach((i) => {
          const p = pts[i], t = label(p), y = W1 * p.x1 + W2 * p.x2 + B >= 0 ? 1 : 0;
          if (y !== t) { errors++; W1 += 0.5 * (t - y) * p.x1; W2 += 0.5 * (t - y) * p.x2; B += 0.5 * (t - y); }
        });
        const sc = score(W1, W2, B);
        if (sc > bestScore) { bestScore = sc; best = [W1, W2, B]; }
        if (!errors) break;
      }
      [W1, W2, B] = best; // "pocket": keep the best weights seen, which matters when no line fits (XOR)
      const m = Math.max(Math.abs(W1), Math.abs(W2), Math.abs(B), 1e-9);
      const k = 3.5 / m; // scaling all three keeps the same boundary, and larger values survive rounding to 0.1
      w1.set(Math.round(W1 * k * 10) / 10); w2.set(Math.round(W2 * k * 10) / 10); b.set(Math.round(B * k * 10) / 10);
      update();
    }

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const side = Math.min(w - 40, hh - 30), ox = (w - side) / 2 + 10, oy = 8;
      const X = (x) => ox + x * side, Y = (y) => oy + (1 - y) * side;
      const hi = NES.css("--hi"), lo = NES.css("--lo");
      const cells = 40, cs = side / cells;
      for (let i = 0; i < cells; i++) for (let j = 0; j < cells; j++) {
        const x1 = (i + 0.5) / cells, x2 = (j + 0.5) / cells, z = zf(x1, x2);
        const out = act.value === "relu" ? Math.min(1, phi(z)) : phi(z);
        ctx.fillStyle = cls(z) ? hi : lo; ctx.globalAlpha = 0.08 + 0.3 * (cls(z) ? out : 1 - out);
        ctx.fillRect(ox + i * cs, oy + (cells - 1 - j) * cs, cs + 0.5, cs + 0.5);
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = NES.css("--line-2"); ctx.strokeRect(ox, oy, side, side);
      // boundary line w1 x1 + w2 x2 + b = 0
      ctx.save(); ctx.beginPath(); ctx.rect(ox, oy, side, side); ctx.clip();
      ctx.strokeStyle = NES.css("--ink"); ctx.lineWidth = 2; ctx.beginPath();
      if (Math.abs(w2.value) > 1e-9) { const yA = -(b.value + w1.value * -1) / w2.value, yB = -(b.value + w1.value * 2) / w2.value; ctx.moveTo(X(-1), Y(yA)); ctx.lineTo(X(2), Y(yB)); }
      else if (Math.abs(w1.value) > 1e-9) { const xv = -b.value / w1.value; ctx.moveTo(X(xv), Y(-1)); ctx.lineTo(X(xv), Y(2)); }
      ctx.stroke(); ctx.restore();
      pts.forEach((p) => {
        const t = label(p), ok = cls(zf(p.x1, p.x2)) === t;
        ctx.fillStyle = t ? hi : lo; ctx.beginPath(); ctx.arc(X(p.x1), Y(p.x2), 4.5, 0, Math.PI * 2); ctx.fill();
        if (!ok) { ctx.strokeStyle = NES.css("--bad"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(p.x1), Y(p.x2), 8, 0, Math.PI * 2); ctx.stroke(); }
      });
      ctx.fillStyle = NES.css("--muted"); ctx.font = "11px " + NES.css("--font");
      ctx.fillText("x1", ox + side - 12, oy + side + 16); ctx.fillText("x2", ox - 20, oy + 10);
      ctx.fillText("0", ox - 10, oy + side + 12); ctx.fillText("1", ox + side - 2, oy + side + 12);
    });

    function update() {
      const correct = pts.filter((p) => cls(zf(p.x1, p.x2)) === label(p)).length;
      const pct = Math.round((correct / pts.length) * 100);
      stats.set("acc", correct + " / " + pts.length + " (" + pct + "%)", pct === 100 ? "good" : pct >= 75 ? "warn" : "bad");
      const z11 = zf(1, 1);
      stats.set("z", "z = " + z11.toFixed(2) + ", y = " + phi(z11).toFixed(2));
      const term = (v, t) => (v < 0 ? " - " : " + ") + Math.abs(v).toFixed(1) + t;
      stats.set("eq", w1.value.toFixed(1) + "·x1" + term(w2.value, "·x2") + term(b.value, "") + " = 0");
      if (data.value === "xor") setVerdict(verdict, "warn", "<b>XOR cannot be split by one straight line.</b> The best a single neuron can do is 3 of the 4 groups (75%), however long it trains. Stacking neurons into layers, as in the next topics, solves it.");
      else if (pct === 100) setVerdict(verdict, "good", "<b>Every dot is on the right side.</b> Note that changing the activation changes the shading, not the line: a single neuron always splits the plane with one straight boundary.");
      else setVerdict(verdict, "", "<b>Red rings are misclassified dots.</b> Adjust the weights and bias by hand, or press Train to let the perceptron rule find them.");
      draw();
    }
    [w1, w2, b, act, data].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: parameters, MACs and memory of an MLP
     ===================================================================== */
  function labDense(el) {
    const { controls, view } = NES.lab(el, {
      title: "Count the parameters and MACs of a network",
      hint: "A dense layer from n<sub>in</sub> inputs to n<sub>out</sub> neurons has n<sub>in</sub>·n<sub>out</sub> weights and n<sub>out</sub> biases, and needs n<sub>in</sub>·n<sub>out</sub> multiply-accumulates per inference. The flash sizes are typical values, not a specific chip.",
    });
    const nin = NES.slider(controls, { label: "Inputs", min: 1, max: 1024, step: 1, value: 7, fmt: (v) => String(v) });
    const nh = NES.slider(controls, { label: "Hidden layers", min: 0, max: 4, step: 1, value: 0, fmt: (v) => String(v) });
    const nw = NES.slider(controls, { label: "Neurons per hidden layer", min: 1, max: 512, step: 1, value: 5, fmt: (v) => String(v) });
    const nout = NES.slider(controls, { label: "Outputs", min: 1, max: 100, step: 1, value: 5, fmt: (v) => String(v) });
    const prec = NES.seg(controls, { label: "Weight precision", options: [[4, "float32"], [1, "int8"], [0.5, "int4"]], value: 4 });
    const flash = NES.seg(controls, { label: "Flash for the model", options: [[256e3, "256 kB"], [1e6, "1 MB"], [2e6, "2 MB"]], value: 256e3 });
    const presets = h("div", { class: "btn-row" });
    [["Slide 17: 7 → 5", [7, 0, 5, 5]], ["Slide 18: 5 → 5 → 5 → 5 → 3", [5, 3, 5, 3]], ["Digits: 784 → 128 → 128 → 10", [784, 2, 128, 10]]].forEach(([t, v]) =>
      presets.append(btn(t, () => { nin.set(v[0]); nh.set(v[1]); nw.set(v[2]); nout.set(v[3]); update(); }, "btn-sm")));
    controls.append(h("div", { class: "ctl" }, [h("div", { class: "ctl-label", html: "<span>Presets</span>" }), presets]));
    const table = h("div", { class: "table-wrap" });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [table]), meter);
    const stats = NES.stats(view, [{ key: "p", label: "Parameters" }, { key: "m", label: "MACs per inference" }, { key: "s", label: "Model size" }, { key: "fit", label: "Fits in flash?" }]);

    function update() {
      const sizes = [Math.round(nin.value)];
      for (let i = 0; i < Math.round(nh.value); i++) sizes.push(Math.round(nw.value));
      sizes.push(Math.round(nout.value));
      let P = 0, M = 0, rows = "";
      for (let i = 1; i < sizes.length; i++) {
        const a = sizes[i - 1], o = sizes[i], wts = a * o, p = wts + o;
        P += p; M += wts;
        rows += `<tr><td>${i === sizes.length - 1 ? "output" : "hidden " + i}</td><td>${a} → ${o}</td><td>${fmtNum(wts)}</td><td>${fmtNum(o)}</td><td class="out">${fmtNum(p)}</td></tr>`;
      }
      table.innerHTML = `<table class="tt"><thead><tr><th>Layer</th><th>Shape</th><th>Weights</th><th>Biases</th><th class="out">Params</th></tr></thead><tbody>${rows}</tbody></table>`;
      const bytes = P * prec.value, fits = bytes <= flash.value;
      const pct = Math.min(100, (bytes / flash.value) * 100);
      meter.innerHTML = `<div class="meter-row"><span class="m-label">Flash used</span><div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:var(--${fits ? (pct > 75 ? "warn" : "ok") : "bad"})"></div></div><span class="m-val">${((bytes / flash.value) * 100).toFixed(bytes / flash.value < 0.01 ? 2 : 0)}%</span></div>`;
      stats.set("p", fmtNum(P));
      stats.set("m", fmtNum(M));
      stats.set("s", fmtBytes(bytes));
      stats.set("fit", fits ? "yes" : "no, " + (bytes / flash.value).toFixed(1) + "× too big", fits ? "good" : "bad");
    }
    [nin, nh, nw, nout, prec, flash].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: gradient descent on a one-weight model
     ===================================================================== */
  function labGd(el) {
    const { controls, view } = NES.lab(el, {
      title: "Make a guess, measure, optimise, repeat",
      hint: "One weight w, model y = w·x, four training samples. The loss is the mean squared error. Each step moves w against the slope of the loss: w ← w - η·dL/dw. Changing η restarts from the same initial weight, so you can compare a small, a medium and a large learning rate.",
    });
    const XS = [1, 2, 3, 4], YS = [2.3, 3.8, 6.4, 7.9];
    const loss = (w) => mean(XS.map((x, i) => (w * x - YS[i]) ** 2));
    const grad = (w) => mean(XS.map((x, i) => 2 * x * (w * x - YS[i])));
    const wStar = XS.reduce((s, x, i) => s + x * YS[i], 0) / XS.reduce((s, x) => s + x * x, 0);
    const eta = NES.slider(controls, { label: "Learning rate η", min: 0.005, max: 0.15, step: 0.005, value: 0.03, fmt: (v) => v.toFixed(3) });
    let rnd = NES.rng(23), w0 = -1, w = w0, hist = [w];
    controls.append(h("div", { class: "btn-row" }, [
      btn("Step", () => { stepN(1); }),
      btn("Run 20 steps", () => { stepN(20); }),
      btn("Random start", () => { w0 = Math.round((-2 + 7 * rnd()) * 100) / 100; w = w0; hist = [w]; update(); }),
    ]));
    const cv = h("canvas", { style: "height:230px", "aria-label": "Loss curve and loss per step" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "it", label: "Steps" }, { key: "w", label: "Weight w" }, { key: "l", label: "Loss L(w)" }, { key: "g", label: "Slope dL/dw" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);

    function stepN(n) {
      for (let i = 0; i < n; i++) { if (Math.abs(w) > 1e6) break; w = w - eta.value * grad(w); hist.push(w); }
      update();
    }
    const draw = NES.canvas(cv, (ctx, wd, hh) => {
      const split = wd < 520 ? 1 : 0.58;
      const lw = split === 1 ? wd : wd * split - 8, lh = split === 1 ? hh * 0.6 : hh;
      const pad = 26, LMAX = 80;
      const X = (v) => pad + ((v + 2) / 8) * (lw - pad - 6);
      const Y = (l) => 8 + (1 - NES.clamp(l, 0, LMAX) / LMAX) * (lh - 8 - 20);
      ctx.font = "11px " + NES.css("--font");
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(lw - 6, Y(0)); ctx.stroke();
      ctx.fillStyle = NES.css("--muted"); ctx.fillText("loss", 2, 16); ctx.fillText("w", lw - 14, Y(0) + 14);
      [-2, 0, 2, 4, 6].forEach((v) => ctx.fillText(String(v), X(v) - 3, Y(0) + 14));
      ctx.strokeStyle = NES.css("--tech"); ctx.lineWidth = 2; ctx.beginPath();
      for (let px = 0; px <= 200; px++) { const v = -2 + (8 * px) / 200; px ? ctx.lineTo(X(v), Y(loss(v))) : ctx.moveTo(X(v), Y(loss(v))); }
      ctx.stroke();
      // path
      ctx.save(); ctx.beginPath(); ctx.rect(pad, 0, lw - pad, lh); ctx.clip();
      ctx.strokeStyle = NES.css("--accent"); ctx.lineWidth = 1.2; ctx.beginPath();
      hist.forEach((v, i) => { const cl = NES.clamp(v, -3, 7); i ? ctx.lineTo(X(cl), Y(loss(v))) : ctx.moveTo(X(cl), Y(loss(v))); });
      ctx.stroke();
      hist.forEach((v, i) => { ctx.fillStyle = i === hist.length - 1 ? NES.css("--accent") : NES.css("--muted"); ctx.beginPath(); ctx.arc(X(NES.clamp(v, -3, 7)), Y(loss(v)), i === hist.length - 1 ? 5 : 2.5, 0, Math.PI * 2); ctx.fill(); });
      ctx.restore();
      // loss per step
      const ox = split === 1 ? 0 : wd * split + 8, oy = split === 1 ? lh + 6 : 0, ow = split === 1 ? wd : wd * (1 - split) - 8, oh = split === 1 ? hh - lh - 6 : hh;
      const n = Math.max(20, hist.length - 1);
      const SX = (i) => ox + 26 + (i / n) * (ow - 32), SY = (l) => oy + 6 + (1 - NES.clamp(l, 0, LMAX) / LMAX) * (oh - 26);
      ctx.strokeStyle = NES.css("--line-2"); ctx.strokeRect(ox + 26, oy + 6, ow - 32, oh - 26);
      ctx.fillStyle = NES.css("--muted"); ctx.fillText("loss per step", ox + 30, oy + 18); ctx.fillText("0", ox + 22, oy + oh - 6); ctx.fillText(String(n), ox + ow - 22, oy + oh - 6);
      ctx.strokeStyle = NES.css("--accent"); ctx.lineWidth = 1.8; ctx.beginPath();
      hist.forEach((v, i) => { i ? ctx.lineTo(SX(i), SY(loss(v))) : ctx.moveTo(SX(i), SY(loss(v))); });
      ctx.stroke();
    });
    function update() {
      const L = loss(w), g = grad(w);
      stats.set("it", String(hist.length - 1));
      stats.set("w", Math.abs(w) > 1e4 ? w.toExponential(1) : w.toFixed(3));
      stats.set("l", L > 1e5 ? L.toExponential(1) : L.toFixed(3), L < 0.3 ? "good" : "");
      stats.set("g", Math.abs(g) > 1e4 ? g.toExponential(1) : g.toFixed(3));
      const curv = 2 * mean(XS.map((x) => x * x)); // second derivative of the loss = 15
      const e = eta.value;
      if (e >= 2 / curv) setVerdict(verdict, "bad", "<b>Diverging.</b> With η = " + e.toFixed(3) + " every step overshoots the minimum by more than it corrects, so the loss grows. For this loss any η above " + (2 / curv).toFixed(3) + " diverges.");
      else if (e > 1 / curv) setVerdict(verdict, "warn", "<b>Oscillating.</b> Each step jumps across the valley (w alternates sides of the minimum at " + wStar.toFixed(3) + ") but still gets closer.");
      else setVerdict(verdict, "good", "<b>Converging.</b> The steps shrink as the slope flattens near the minimum at w = " + wStar.toFixed(3) + ". A very small η is safe but needs many steps.");
      draw();
    }
    eta.onchange = () => { w = w0; hist = [w]; update(); };
    update();
  }

  /* =====================================================================
     LAB: latency, energy and battery budget
     ===================================================================== */
  function labBudget(el) {
    const { controls, view } = NES.lab(el, {
      title: "Does the model fit the latency and energy budget?",
      hint: "Illustrative hardware: a 64 MHz Cortex-M class MCU doing about 0.5 float32 or 2 int8 MACs per cycle (with SIMD) at 10 mW, or the same MCU with a small NPU doing 64 int8 MACs per cycle at 20 mW. Asleep, the device draws 10 µW.",
    });
    const macs = NES.slider(controls, { label: "MACs per inference", min: 4, max: 8, step: 0.05, value: Math.log10(2e6), map: nice, unmap: (v) => Math.log10(v), fmt: (v) => fmtNum(v) });
    const hw = NES.seg(controls, { label: "Hardware", options: [["mcu", "MCU"], ["npu", "MCU + NPU"]], value: "mcu" });
    const prec = NES.seg(controls, { label: "Precision", options: [["f32", "float32"], ["i8", "int8"]], value: "i8" });
    const rate = NES.slider(controls, { label: "Inferences per second", min: -1, max: 1.3, step: 0.05, value: 0, map: nice, unmap: (v) => Math.log10(v), fmt: (v) => String(v) });
    const budget = NES.slider(controls, { label: "Latency budget", min: 1, max: 500, step: 1, value: 100, fmt: (v) => v + " ms" });
    const batt = NES.seg(controls, { label: "Battery", options: [["coin", "Coin cell"], ["aa", "2 × AA"]], value: "coin" });
    const verdict = h("div", { class: "verdict" });
    const meter = h("div", { class: "meter" });
    view.append(h("div", { class: "stage" }, [meter]));
    const stats = NES.stats(view, [{ key: "t", label: "Inference time" }, { key: "e", label: "Energy per inference" }, { key: "p", label: "Average power" }, { key: "life", label: "Battery life" }]);
    view.append(verdict);
    const BATT = { coin: { wh: 0.225 * 3, name: "CR2032 coin cell (225 mAh, 3 V)" }, aa: { wh: 2.5 * 3, name: "2 × AA (2500 mAh, 3 V)" } };

    function update() {
      const npu = hw.value === "npu";
      const unsupported = npu && prec.value === "f32";
      const perCycle = npu ? 64 : prec.value === "f32" ? 0.5 : 2;
      const P = npu ? 0.020 : 0.010, Psleep = 10e-6;
      const rateMacs = 64e6 * perCycle;
      const t = macs.value / rateMacs, E = P * t, duty = t * rate.value;
      const avg = duty >= 1 ? P : E * rate.value + Psleep * (1 - duty);
      const life = BATT[batt.value].wh / avg;
      const okLat = t * 1000 <= budget.value;
      const pct = Math.min(100, ((t * 1000) / budget.value) * 100);
      meter.innerHTML =
        `<div class="meter-row"><span class="m-label">Latency</span><div class="meter-track"><div class="meter-fill" style="width:${pct}%;background:var(--${unsupported ? "bad" : okLat ? "ok" : "bad"})"></div></div><span class="m-val">${unsupported ? "n/a" : Math.round(((t * 1000) / budget.value) * 100) + "%"}</span></div>` +
        `<div class="meter-row"><span class="m-label">Busy time</span><div class="meter-track"><div class="meter-fill" style="width:${Math.min(100, duty * 100)}%;background:var(--${duty >= 1 ? "bad" : duty > 0.5 ? "warn" : "tech"})"></div></div><span class="m-val">${unsupported ? "n/a" : (Math.min(duty, 9.99) * 100).toFixed(duty < 0.01 ? 2 : 0) + "%"}</span></div>`;
      if (unsupported) {
        ["t", "e", "p", "life"].forEach((k) => stats.set(k, "n/a", "bad"));
        setVerdict(verdict, "bad", "<b>Not supported.</b> NPUs are built for low-precision arithmetic (INT8 or less). A float32 model has to be quantized before the NPU can run it.");
        return;
      }
      stats.set("t", fmtTime(t), okLat ? "good" : "bad");
      stats.set("e", fmtEnergy(E));
      stats.set("p", fmtPower(avg));
      stats.set("life", fmtDuration(life / 1), life > 24 * 365 ? "good" : life > 24 * 30 ? "warn" : "bad");
      if (duty >= 1) setVerdict(verdict, "bad", "<b>Cannot keep up.</b> One inference takes " + fmtTime(t) + ", but a new one is due every " + fmtTime(1 / rate.value) + ". The processor never sleeps.");
      else if (!okLat) setVerdict(verdict, "bad", "<b>Over the latency budget.</b> " + fmtTime(t) + " per inference is more than the " + budget.value + " ms the application allows. Use fewer operations, int8, or an accelerator.");
      else setVerdict(verdict, "good", "<b>Fits.</b> " + fmtTime(t) + " per inference, busy " + (duty * 100).toFixed(duty < 0.01 ? 2 : 1) + "% of the time. On a " + BATT[batt.value].name + " that lasts about " + fmtDuration(life) + ".");
    }
    [macs, hw, prec, rate, budget, batt].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: hand-selected features (mean, variance, peak-to-peak)
     ===================================================================== */
  function labFeatures(el) {
    const { controls, view } = NES.lab(el, {
      title: "Turn a window of samples into a few features",
      hint: "Twenty simulated accelerometer windows of 100 samples each: ten from an idle forklift, ten from a moving one. Pick a feature and a threshold: the rule is 'moving if the feature is above the threshold'.",
    });
    const N = 100, r = NES.rng(31);
    const wins = [];
    for (let k = 0; k < 20; k++) {
      const moving = k >= 10, f = 2 + 3 * r(), ph = 2 * Math.PI * r(), amp = 0.18 + 0.12 * r();
      const s = Array.from({ length: N }, (_, i) => 1 + (moving ? amp * Math.sin((2 * Math.PI * f * i) / N + ph) + 0.12 * NES.gauss(r) : 0.02 * NES.gauss(r)));
      const m = mean(s), v = mean(s.map((x) => (x - m) ** 2)), p2p = Math.max(...s) - Math.min(...s);
      wins.push({ moving, s, f: { mean: m, var: v, p2p } });
    }
    const RANGES = { mean: [0.95, 1.05, 0.001, 1.0], var: [0, 0.08, 0.001, 0.01], p2p: [0, 1.6, 0.01, 0.3] };
    const which = NES.seg(controls, { label: "Show window", options: [["idle", "Idle"], ["moving", "Moving"]], value: "moving" });
    const idx = NES.slider(controls, { label: "Window number", min: 1, max: 10, step: 1, value: 1, fmt: (v) => "#" + v });
    const feat = NES.seg(controls, { label: "Feature for the rule", options: [["mean", "Mean"], ["var", "Variance"], ["p2p", "Peak-to-peak"]], value: "mean" });
    const thr = NES.slider(controls, { label: "Threshold", min: 0.95, max: 1.05, step: 0.001, value: 1.0, fmt: (v) => v.toFixed(3) });
    const cv = h("canvas", { style: "height:250px", "aria-label": "Sensor window and feature values" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "m", label: "Mean" }, { key: "v", label: "Variance" }, { key: "p", label: "Peak-to-peak" }, { key: "acc", label: "Rule accuracy (20 windows)" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);

    function setRange() {
      const [lo, hi, st, def] = RANGES[feat.value];
      thr.input.min = lo; thr.input.max = hi; thr.input.step = st; thr.set(def);
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const win = wins[(which.value === "moving" ? 10 : 0) + Math.round(idx.value) - 1];
      const topH = hh * 0.58, pad = 30;
      const X = (i) => pad + (i / (N - 1)) * (w - pad - 8), Y = (v) => 8 + (1 - (NES.clamp(v, 0.3, 1.7) - 0.3) / 1.4) * (topH - 16);
      ctx.font = "11px " + NES.css("--font");
      ctx.strokeStyle = NES.css("--grid"); [0.5, 1, 1.5].forEach((v) => { ctx.beginPath(); ctx.moveTo(pad, Y(v)); ctx.lineTo(w - 8, Y(v)); ctx.stroke(); });
      ctx.fillStyle = NES.css("--muted"); ctx.fillText("1 g", 2, Y(1) + 4); ctx.fillText("samples", w - 52, topH - 2);
      ctx.strokeStyle = NES.css(win.moving ? "--hi" : "--lo"); ctx.lineWidth = 1.5; ctx.beginPath();
      win.s.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)))); ctx.stroke();
      // feature strip
      const [lo, hi] = RANGES[feat.value];
      const y0 = topH + 22, FX = (v) => pad + ((NES.clamp(v, lo, hi) - lo) / (hi - lo)) * (w - pad - 8);
      ctx.strokeStyle = NES.css("--line-2"); ctx.beginPath(); ctx.moveTo(pad, y0 + 26); ctx.lineTo(w - 8, y0 + 26); ctx.stroke();
      ctx.fillStyle = NES.css("--muted"); ctx.fillText(lo.toFixed(feat.value === "p2p" ? 1 : feat.value === "var" ? 2 : 2), pad - 4, y0 + 42);
      const hiTxt = hi.toFixed(feat.value === "p2p" ? 1 : 2); ctx.fillText(hiTxt, w - 8 - ctx.measureText(hiTxt).width, y0 + 42);
      ctx.fillText("feature value of all 20 windows", pad, y0 - 6);
      wins.forEach((wn, k) => {
        ctx.fillStyle = NES.css(wn.moving ? "--hi" : "--lo");
        ctx.beginPath(); ctx.arc(FX(wn.f[feat.value]), y0 + 10 + (wn.moving ? 10 : 0), 4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.strokeStyle = NES.css("--accent"); ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(FX(thr.value), y0); ctx.lineTo(FX(thr.value), y0 + 30); ctx.stroke(); ctx.setLineDash([]);
    });
    function update() {
      const win = wins[(which.value === "moving" ? 10 : 0) + Math.round(idx.value) - 1];
      stats.set("m", win.f.mean.toFixed(3));
      stats.set("v", win.f.var.toFixed(4));
      stats.set("p", win.f.p2p.toFixed(3));
      const correct = wins.filter((wn) => (wn.f[feat.value] > thr.value) === wn.moving).length;
      stats.set("acc", correct * 5 + "%", correct === 20 ? "good" : correct >= 15 ? "warn" : "bad");
      if (feat.value === "mean") setVerdict(verdict, "warn", "<b>The mean does not help here.</b> Idle and moving windows both average about 1 g (gravity), so no threshold separates them. A feature has to capture what differs: how much the signal moves.");
      else if (correct === 20) setVerdict(verdict, "good", "<b>One number per window separates the classes.</b> With a good feature the learning problem becomes almost trivial, which is exactly the point of preprocessing.");
      else setVerdict(verdict, "", "<b>Move the threshold</b> into the gap between the blue (idle) and orange (moving) dots.");
      draw();
    }
    feat.onchange = () => { setRange(); update(); };
    [which, idx, thr].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: evaluation metrics (accuracy and MAE)
     ===================================================================== */
  function labMetrics(el) {
    const { controls, view } = NES.lab(el, {
      title: "Compute accuracy and MAE by hand",
      hint: "Classification: ten test audio clips, 1 = keyword present. Click a prediction to flip it. Regression: six test cups, the target is the liquid level in mm; the slider scales the model's errors.",
    });
    const mode = NES.seg(controls, { label: "Task", options: [["cls", "Classification"], ["reg", "Regression"]], value: "cls" });
    const scale = NES.slider(controls, { label: "Regression model error", min: 0, max: 3, step: 0.1, value: 1, fmt: (v) => "× " + v.toFixed(1) });
    const T = [1, 0, 0, 1, 1, 0, 1, 0, 0, 1];
    const Y = [1, 0, 1, 1, 0, 0, 1, 0, 0, 1];
    const RT = [12, 30, 45, 58, 71, 90], RE = [3, -2, 6, -4, 1, -5];
    const box = h("div", { class: "stage" });
    view.append(box);
    const stats = NES.stats(view, [{ key: "n", label: "N (test samples)" }, { key: "metric", label: "Metric" }, { key: "f", label: "Worked out" }]);

    function update() {
      scale.wrap.style.display = mode.value === "reg" ? "" : "none";
      box.innerHTML = "";
      if (mode.value === "cls") {
        const rowT = h("div", { class: "ea-cells", style: "grid-template-columns:70px repeat(10,minmax(0,1fr))" }, [h("span", { class: "lab-hint", style: "margin:0", text: "Target T" })]);
        const rowY = h("div", { class: "ea-cells", style: "grid-template-columns:70px repeat(10,minmax(0,1fr))" }, [h("span", { class: "lab-hint", style: "margin:0", text: "Output Y" })]);
        T.forEach((t, i) => {
          rowT.append(h("span", { class: "cell b" + t, text: String(t) }));
          rowY.append(h("button", { type: "button", class: "cell b" + Y[i] + (Y[i] !== t ? " wrong" : " right"), text: String(Y[i]), "aria-label": "Prediction " + (i + 1) + ": " + Y[i] + ", click to flip", onclick: () => { Y[i] = 1 - Y[i]; update(); } }));
        });
        box.append(rowT, rowY);
        const ok = T.filter((t, i) => t === Y[i]).length;
        stats.set("n", "10");
        stats.set("metric", "accuracy = " + ok * 10 + "%", ok >= 9 ? "good" : ok >= 7 ? "warn" : "bad");
        stats.set("f", "(1/10) · " + ok + " matches");
      } else {
        const Yr = RT.map((t, i) => t + scale.value * RE[i]);
        const errs = Yr.map((y, i) => Math.abs(y - RT[i]));
        box.innerHTML = `<div class="table-wrap"><table class="tt"><thead><tr><th>Cup</th>${RT.map((_, i) => `<th>${i + 1}</th>`).join("")}</tr></thead><tbody>` +
          `<tr><td>T (mm)</td>${RT.map((t) => `<td>${t}</td>`).join("")}</tr>` +
          `<tr><td>Y (mm)</td>${Yr.map((y) => `<td>${y.toFixed(1)}</td>`).join("")}</tr>` +
          `<tr><td>|Y - T|</td>${errs.map((e) => `<td class="${e > 5 ? "v-bad" : ""}">${e.toFixed(1)}</td>`).join("")}</tr></tbody></table></div>`;
        const mae = mean(errs);
        stats.set("n", "6");
        stats.set("metric", "MAE = " + mae.toFixed(2) + " mm", mae < 3 ? "good" : mae < 6 ? "warn" : "bad");
        stats.set("f", "(" + errs.map((e) => e.toFixed(1)).join(" + ") + ") / 6");
      }
    }
    [mode, scale].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: uniform (affine) quantization
     ===================================================================== */
  function quantParams(min, max, bits) {
    const qmax = Math.pow(2, bits) - 1;
    const scale = (max - min) / qmax;
    const zp = NES.clamp(Math.round(-min / scale), 0, qmax);
    return { qmax, scale, zp };
  }
  function quantize(x, p) {
    const raw = Math.round(x / p.scale) + p.zp;
    const q = NES.clamp(raw, 0, p.qmax);
    return { q, clipped: q !== raw, xhat: (q - p.zp) * p.scale };
  }

  function labQuant(el) {
    const { controls, view } = NES.lab(el, {
      title: "Quantize and de-quantize a value",
      hint: "The slide's formulas: q = round(x / scale) + zero_point and x = (q - zero_point) × scale. Here the scale and zero point are computed from the chosen range: scale = (max - min) / (2<sup>bits</sup> - 1), zero_point = round(-min / scale). Defaults reproduce the slide's -5.4 to +4.5 example.",
    });
    const mn = NES.slider(controls, { label: "Range minimum", min: -10, max: -0.1, step: 0.1, value: -5.4, fmt: (v) => v.toFixed(1) });
    const mx = NES.slider(controls, { label: "Range maximum", min: 0.1, max: 10, step: 0.1, value: 4.5, fmt: (v) => v.toFixed(1) });
    const bits = NES.seg(controls, { label: "Integer bits", options: [[8, "8"], [4, "4"], [2, "2"]], value: 8 });
    const x = NES.slider(controls, { label: "Float value x", min: -10, max: 10, step: 0.01, value: 1.0, fmt: (v) => v.toFixed(2) });
    const cv = h("canvas", { style: "height:170px", "aria-label": "Float value mapped to an integer code and back" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "s", label: "scale" }, { key: "z", label: "zero_point" }, { key: "q", label: "q" }, { key: "xh", label: "Reconstructed x" }, { key: "e", label: "Error" }]);
    const wtable = h("div", { class: "table-wrap" });
    view.append(h("div", { class: "codebar-title", html: "The slide 37 weights, quantized with the same number of bits over their own range [0, 71.324]" }), wtable);
    const WEIGHTS = [13.45678, 9.34, 32.12, 3.445, 2.45678, 1.22, 1.154, 11.43, 71.324, 1.2543];

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const p = quantParams(mn.value, mx.value, bits.value);
      const r = quantize(x.value, p);
      const lo = Math.min(mn.value, x.value), hi = Math.max(mx.value, x.value);
      const pad = 18, X = (v) => pad + ((v - lo) / (hi - lo || 1)) * (w - 2 * pad);
      const yTop = 26, yCodes = 72, yBot = hh - 34;
      ctx.font = "11px " + NES.css("--font");
      // float lines
      ctx.strokeStyle = NES.css("--ink-2"); ctx.lineWidth = 2;
      [yTop, yBot].forEach((y) => { ctx.beginPath(); ctx.moveTo(X(mn.value), y); ctx.lineTo(X(mx.value), y); ctx.stroke(); });
      ctx.fillStyle = NES.css("--muted");
      ctx.fillText("original float", pad, yTop - 10);
      ctx.fillText("reconstructed float", pad, yBot + 22);
      const lab = (t, v, y) => { const tw = ctx.measureText(t).width; ctx.fillText(t, NES.clamp(X(v) - tw / 2, 0, w - tw), y); };
      lab(mn.value.toFixed(1), mn.value, yTop + 14);
      lab(mx.value.toFixed(1), mx.value, yTop + 14);
      // codes
      const n = p.qmax + 1, every = n > 16 ? n / 8 : 1;
      ctx.strokeStyle = NES.css("--line-2"); ctx.lineWidth = 1;
      for (let q = 0; q < n; q += every) {
        const v = (q - p.zp) * p.scale, xx = X(v);
        ctx.beginPath(); ctx.moveTo(xx, yCodes - 8); ctx.lineTo(xx, yCodes + 8); ctx.stroke();
        if (n <= 16 || q % (every * 2) === 0) { ctx.fillStyle = NES.css("--muted"); lab(String(q), v, yCodes + 22); }
      }
      const vmax = (p.qmax - p.zp) * p.scale;
      ctx.beginPath(); ctx.moveTo(X(vmax), yCodes - 8); ctx.lineTo(X(vmax), yCodes + 8); ctx.stroke();
      ctx.fillStyle = NES.css("--muted"); lab(String(p.qmax), vmax, yCodes + 22);
      // value path
      const xq = X((r.q - p.zp) * p.scale);
      ctx.strokeStyle = NES.css(r.clipped ? "--bad" : "--accent"); ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(X(x.value), yTop); ctx.lineTo(xq, yCodes); ctx.lineTo(xq, yBot); ctx.stroke();
      ctx.fillStyle = NES.css("--accent");
      ctx.beginPath(); ctx.arc(X(x.value), yTop, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(xq, yBot, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = NES.css(r.clipped ? "--bad" : "--accent"); ctx.font = "bold 12px " + NES.css("--font");
      lab("q = " + r.q, (r.q - p.zp) * p.scale, yCodes - 12);
    });
    function update() {
      const p = quantParams(mn.value, mx.value, bits.value);
      const r = quantize(x.value, p);
      const err = x.value - r.xhat;
      stats.set("s", p.scale.toFixed(4));
      stats.set("z", String(p.zp));
      stats.set("q", String(r.q) + (r.clipped ? " (clipped)" : ""), r.clipped ? "bad" : "");
      stats.set("xh", r.xhat.toFixed(4));
      stats.set("e", (err >= 0 ? "+" : "") + err.toFixed(4), r.clipped ? "bad" : Math.abs(err) <= p.scale / 2 + 1e-9 ? "good" : "warn");
      const wp = quantParams(0, Math.max(...WEIGHTS), bits.value);
      const rows = WEIGHTS.map((v) => { const rr = quantize(v, wp); return [v, rr.q, rr.xhat]; });
      const bytesF = WEIGHTS.length * 4, bytesQ = (WEIGHTS.length * bits.value) / 8;
      wtable.innerHTML = `<table class="tt"><thead><tr><th>float32</th>${rows.map((rw) => `<td>${rw[0]}</td>`).join("")}</tr></thead><tbody>` +
        `<tr><th>q</th>${rows.map((rw) => `<td>${rw[1]}</td>`).join("")}</tr>` +
        `<tr><th>back</th>${rows.map((rw) => `<td>${rw[2].toFixed(2)}</td>`).join("")}</tr></tbody></table>` +
        `<p class="lab-hint" style="margin:6px 0 0">scale = ${wp.scale.toFixed(4)}, zero point = ${wp.zp}. Storage: ${bytesF} bytes as float32, ${bytesQ} bytes as ${bits.value}-bit integers (${(bytesF / bytesQ).toFixed(0)}× smaller). Small weights such as 1.154 and 1.2543 become hard to tell apart.</p>`;
      draw();
    }
    [mn, mx, bits, x].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     LAB: distribution shift and single-change adaptation
     ===================================================================== */
  function labDrift(el) {
    const { controls, view } = NES.lab(el, {
      title: "Trained on one machine, deployed on another",
      hint: "Illustrative: a vibration feature separates 'normal' from 'faulty' on the machine the training data came from (process P). The new machine (P¹) reads everything shifted, for example because the sensor is mounted differently. The threshold is the midpoint between the two class means.",
    });
    const shift = NES.slider(controls, { label: "Shift on the new machine", min: -1, max: 1, step: 0.05, value: 0.6, fmt: (v) => (v >= 0 ? "+" : "") + v.toFixed(2) });
    const k = NES.slider(controls, { label: "Labelled samples collected on device", min: 2, max: 40, step: 2, value: 6, fmt: (v) => String(v) });
    let adapted = false;
    const adaptBtn = btn("Adapt on device", () => { adapted = true; update(); });
    controls.append(h("div", { class: "btn-row" }, [adaptBtn, btn("Reset", () => { adapted = false; update(); })]));
    const cv = h("canvas", { style: "height:210px", "aria-label": "Training and deployment data with thresholds" });
    view.append(h("div", { class: "stage" }, [cv]));
    view.append(h("div", { class: "legend", html: `<span><i style="background:var(--lo);height:8px;width:8px;border-radius:50%"></i>normal</span><span><i style="background:var(--hi);height:8px;width:8px;border-radius:50%"></i>faulty</span><span><i class="dash" style="color:var(--accent)"></i>threshold learned from P</span><span><i style="background:var(--ok)"></i>threshold after adaptation</span>` }));
    const stats = NES.stats(view, [{ key: "a0", label: "Accuracy on P (training machine)" }, { key: "a1", label: "On P¹, original model" }, { key: "a2", label: "On P¹, after adaptation" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);

    const r = NES.rng(41);
    const mk = (mu, n) => Array.from({ length: n }, () => mu + 0.2 * NES.gauss(r));
    const trainN = mk(1.0, 60), trainF = mk(2.0, 60), depN = mk(1.0, 60), depF = mk(2.0, 60);
    const th0 = (mean(trainN) + mean(trainF)) / 2;
    const acc = (normals, faults, th) => (normals.filter((v) => v <= th).length + faults.filter((v) => v > th).length) / (normals.length + faults.length);

    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const s = shift.value, lo = -0.2, hi = 3.4, pad = 10;
      const X = (v) => pad + ((v - lo) / (hi - lo)) * (w - 2 * pad);
      const rows = [["Training machine (P)", trainN, trainF, 0], ["New machine (P¹)", depN, depF, s]];
      ctx.font = "11px " + NES.css("--font");
      rows.forEach(([name, a, b2, off], ri) => {
        const y0 = 22 + ri * ((hh - 30) / 2);
        ctx.fillStyle = NES.css("--muted"); ctx.fillText(name, pad, y0 - 6);
        const rr = NES.rng(7 + ri);
        a.forEach((v) => { ctx.fillStyle = NES.css("--lo"); ctx.beginPath(); ctx.arc(X(v + off), y0 + 8 + 50 * rr() * 0.6, 3, 0, Math.PI * 2); ctx.fill(); });
        b2.forEach((v) => { ctx.fillStyle = NES.css("--hi"); ctx.beginPath(); ctx.arc(X(v + off), y0 + 8 + 50 * rr() * 0.6, 3, 0, Math.PI * 2); ctx.fill(); });
        ctx.strokeStyle = NES.css("--accent"); ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(X(th0), y0); ctx.lineTo(X(th0), y0 + 42); ctx.stroke(); ctx.setLineDash([]);
        if (ri === 1 && adapted) {
          ctx.strokeStyle = NES.css("--ok"); ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(X(thNew()), y0); ctx.lineTo(X(thNew()), y0 + 42); ctx.stroke();
        }
      });
    });
    function thNew() {
      const half = Math.max(1, Math.round(k.value / 2));
      return (mean(depN.slice(0, half).map((v) => v + shift.value)) + mean(depF.slice(0, half).map((v) => v + shift.value))) / 2;
    }
    function update() {
      const s = shift.value;
      const dn = depN.map((v) => v + s), df = depF.map((v) => v + s);
      const a0 = acc(trainN, trainF, th0), a1 = acc(dn, df, th0);
      stats.set("a0", (a0 * 100).toFixed(0) + "%", "good");
      stats.set("a1", (a1 * 100).toFixed(0) + "%", a1 > 0.95 ? "good" : a1 > 0.8 ? "warn" : "bad");
      if (adapted) {
        const a2 = acc(dn, df, thNew());
        stats.set("a2", (a2 * 100).toFixed(0) + "%", a2 > 0.95 ? "good" : "warn");
        setVerdict(verdict, "good", "<b>Adapted.</b> From only " + k.value + " labelled samples collected on the new machine, the device re-estimated the class means and moved its threshold from " + th0.toFixed(2) + " to " + thNew().toFixed(2) + ". This is single-change adaptation: learn once after deployment, then infer.");
      } else {
        stats.set("a2", "press Adapt");
        setVerdict(verdict, a1 > 0.95 ? "good" : "bad", a1 > 0.95 ? "<b>Small shift, no harm.</b> The original threshold still separates the classes." : "<b>The model fails on P¹.</b> It is still the same, correct model for P, but the new machine's data comes from a different distribution.");
      }
      draw();
    }
    shift.onchange = () => { adapted = false; update(); };
    k.onchange = update;
    update();
  }

  /* =====================================================================
     LAB: continuous adaptation to sensor drift
     ===================================================================== */
  function labContinual(el) {
    const { controls, view } = NES.lab(el, {
      title: "Keep up with a sensor that drifts for ten years",
      hint: "Illustrative model of the slide's 'pressure sensor drift': the offset falls slowly over ten years. The sensor is calibrated in the factory at year 0 and installed at year 1. A recalibration uses a known reference (for example a resting pressure) to re-estimate the offset.",
    });
    const strat = NES.seg(controls, { label: "Strategy", options: [["none", "Factory only"], ["once", "Once at install"], ["cont", "Continuous"]], value: "none" });
    const months = NES.slider(controls, { label: "Recalibrate every", min: 1, max: 48, step: 1, value: 12, fmt: (v) => v + " months" });
    const cv = h("canvas", { style: "height:220px", "aria-label": "Measurement error over ten years" });
    view.append(h("div", { class: "stage" }, [cv]));
    const stats = NES.stats(view, [{ key: "max", label: "Worst error (years 1 to 10)" }, { key: "avg", label: "Average error" }, { key: "n", label: "Recalibrations" }]);
    const verdict = h("div", { class: "verdict" });
    view.append(verdict);

    const offset = (t) => -0.04 * Math.pow(t, 0.85); // bar, illustrative
    function errorCurve(s) {
      const pts = [];
      let est = offset(0), updates = 0, next = 1;
      for (let i = 0; i <= 1000; i++) {
        const t = (10 * i) / 1000;
        if (s === "once" && t >= 1 && updates === 0) { est = offset(1); updates = 1; }
        if (s === "cont" && t >= next - 1e-9) { est = offset(t); updates++; next += months.value / 12; }
        pts.push([t, offset(t) - est]);
      }
      return { pts, updates };
    }
    const draw = NES.canvas(cv, (ctx, w, hh) => {
      const pad = 34, EMAX = 0.3;
      const X = (t) => pad + (t / 10) * (w - pad - 8), Y = (e) => 10 + (Math.min(Math.abs(e), EMAX) / EMAX) * (hh - 34);
      ctx.font = "11px " + NES.css("--font");
      ctx.strokeStyle = NES.css("--grid"); ctx.lineWidth = 1;
      [0, 0.1, 0.2, 0.3].forEach((e) => { ctx.beginPath(); ctx.moveTo(pad, Y(e)); ctx.lineTo(w - 8, Y(e)); ctx.stroke(); });
      ctx.fillStyle = NES.css("--muted");
      [0, 0.1, 0.2, 0.3].forEach((e) => ctx.fillText(e.toFixed(1), 4, Y(e) + 4));
      [0, 2, 4, 6, 8, 10].forEach((t) => ctx.fillText(String(t), X(t) - 3, hh - 8));
      ctx.fillText("years", w - 44, hh - 20);
      ctx.fillText("|error| (bar)", pad + 4, 22);
      ctx.fillStyle = NES.css("--lab-bg"); ctx.globalAlpha = 0.6; ctx.fillRect(pad, 10, X(1) - pad, hh - 34); ctx.globalAlpha = 1;
      [["none", "--muted"], ["once", "--warn"], ["cont", "--ok"]].forEach(([s, col]) => {
        const { pts } = errorCurve(s), sel = s === strat.value;
        ctx.strokeStyle = NES.css(sel ? (s === "none" ? "--bad" : col) : "--line-2"); ctx.lineWidth = sel ? 2.4 : 1.2;
        ctx.beginPath(); pts.forEach(([t, e], i) => (i ? ctx.lineTo(X(t), Y(e)) : ctx.moveTo(X(t), Y(e)))); ctx.stroke();
      });
    });
    function update() {
      months.wrap.style.opacity = strat.value === "cont" ? "" : "0.45";
      const { pts, updates } = errorCurve(strat.value);
      const dep = pts.filter(([t]) => t >= 1);
      const maxE = Math.max(...dep.map(([, e]) => Math.abs(e))), avgE = mean(dep.map(([, e]) => Math.abs(e)));
      stats.set("max", maxE.toFixed(3) + " bar", maxE < 0.03 ? "good" : maxE < 0.1 ? "warn" : "bad");
      stats.set("avg", avgE.toFixed(3) + " bar");
      stats.set("n", String(updates));
      if (strat.value === "none") setVerdict(verdict, "bad", "<b>The error keeps growing.</b> The model (here, the calibration) is right for the data at year 0, and the data keeps moving away from it.");
      else if (strat.value === "once") setVerdict(verdict, "warn", "<b>Single-change adaptation helps only at first.</b> Calibrating at installation removes the drift up to year 1, but the drift continues afterwards.");
      else setVerdict(verdict, "good", "<b>Continuous adaptation bounds the error.</b> " + updates + " recalibrations keep the error below " + maxE.toFixed(3) + " bar. More frequent updates cost more energy, memory and reference data: the ODL challenges.");
      draw();
    }
    [strat, months].forEach((c) => (c.onchange = update));
    update();
  }

  /* =====================================================================
     Boot
     ===================================================================== */
  const LABS = {
    blerp: labBlerp,
    rule: labRule,
    overfit: labOverfit,
    neuron: labNeuron,
    dense: labDense,
    gd: labGd,
    budget: labBudget,
    features: labFeatures,
    metrics: labMetrics,
    quant: labQuant,
    drift: labDrift,
    continual: labContinual,
  };

  function boot() {
    NES.initPage();
    document.querySelectorAll("[data-lab]").forEach((el) => {
      const fn = LABS[el.dataset.lab];
      if (!fn) return;
      try { fn(el); } catch (e) { el.textContent = "This lab failed to load: " + e.message; console.error(e); }
    });
    NES.initQuizzes("embedded-ai", QUIZ);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
