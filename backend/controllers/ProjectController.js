
const Project = require("../models/Project")
const User = require('../models/User')
const transporter = require('../config/mailer')

const createProject = async (req, res) => {
    try {
        const user = await User.findById(req.body.lead);
        if (!user) {
            return res.status(404).json({ msg: "Lead user not found" }); 
        }
        if (!["Developer", "Manager"].includes(user.role)) {
            return res.status(403).json({ msg: "User is not eligible to be a lead" }); 
        }
        const projectData = {
            ...req.body,
            tasks: [] 
        };
        
        let project = new Project(projectData);
        await project.save();

         const leadUser = await User.findById(req.body.lead);
         const memberUsers = await User.find({ _id: { $in: req.body.members } });
 
         const mailOptions = {
             from: 'jira.tool@gmail.com', 
             to: [leadUser.email, ...memberUsers.map(member => member.email)].join(', '), 
             subject: 'New Project Assigned: ' + project.name,
             html: `<p>Dear ${leadUser.name} and team,</p>
                    <p>A new project has been assigned to you:</p>
                    <ul>
                        <li><strong>Project Name:</strong> ${project.name}</li>
                        <li><strong>Description:</strong> ${project.description}</li>
                        <li><strong>Key:</strong> ${project.key}</li>
                    </ul>
                    <p>Please start working on it.</p>`
         };
 
         transporter.sendMail(mailOptions, function (err, info) {
             if (err) {
                 console.log(err);
             } else {
                 console.log('Email sent: ' + info.response);
             }
         });
        
        res.status(201).json({ msg: "Project created", project }); 
    } catch (err) {
        console.error("Project Creation Error:", err);
        res.status(500).json({ msg: "Error in project creation", error: err.message }); 
    }
};

const getProjects = async (req, res) => {
    try {
        let projects = await Project.find()
            .populate("lead")
            .populate("members")
            .populate("tasks.assignedTo") // Populating assigned user in tasks
            .populate("comments.user"); // Populating user in comments

        if (!projects || projects.length === 0) {
            return res.json({ msg: "Project not found" });
        }

        // Formatting the response properly
        const simplifiedProjects = projects.map(project => ({
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            category: project.category || 'To Do',
            status: project.status || 'active',
            lead: project.lead ? {
                _id: project.lead._id,
                name: project.lead.name,
                role: project.lead.role,
            } : null,
            members: project.members.length > 0 ? project.members.map(member => ({
                _id: member._id,
                name: member.name,
                role: member.role,
            })) : [],
            createdAt: project.createdAt, 
            updatedAt: project.updatedAt, 
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            pendingDate: project.pendingDate,
            doneDate: project.doneDate,
            tasks: project.tasks.length > 0 ? project.tasks.map(task => ({
                _id: task._id,
                name: task.name,
                status: task.status,
                assignedTo: task.assignedTo ? {
                    _id: task.assignedTo._id,
                    name: task.assignedTo.name
                } : null,
                startDate: task.startDate,
                endDate: task.endDate,
            })) : [],
            comments: project.comments.length > 0 ? project.comments.map(comment => ({
                _id: comment._id,
                text: comment.text,
                user: comment.user ? {
                    _id: comment.user._id,
                    name: comment.user.name
                } : null,
                createdAt: comment.createdAt,
            })) : [],
        }));

        res.json(simplifiedProjects);
    } catch (err) {
        console.error("Error fetching projects:", err);
        res.status(500).json({ msg: "Error in fetching projects", error: err.message });
    }
};


const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params._id).populate("lead members");

        if (!project) {
            return res.status(404).json({ msg: "Project not found" }); 
        }

        const simplifiedLead = project.lead ? {
            _id: project.lead._id,
            name: project.lead.name,
            role: project.lead.role,
        } : null; 

        const simplifiedMembers = project.members ? project.members.map(member => ({
            _id: member._id,
            name: member.name,
            role: member.role,
        })) : []; 

         const simplifiedTasks = project.tasks ? project.tasks.map(task => ({
            _id: task._id,
            name: task.name,
            status: task.status,
            assignedTo: task.assignedTo,
            startDate: task.startDate,
            endDate: task.endDate,
        })) : [];

        const simplifiedComments = project.comments ? project.comments.map(comment => ({
            _id: comment._id,
            text: comment.text,
            user: comment.user,
            createdAt: comment.createdAt,
        })) : [];

        const simplifiedProject = {
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            category: project.category, 
            status: project.status,
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            doneDate: project.doneDate,
            lead: simplifiedLead,
            members: simplifiedMembers,
            tasks: simplifiedTasks,
            comments: simplifiedComments,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        };

        res.status(200).json(simplifiedProject); 

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error in fetching project" }); 
    }
};

const updateProject = async (req, res) => {
    try {
        const { _id } = req.params;
        const { comment, user, tasks, status, category, lead, members, name, key, description } = req.body;

        const project = await Project.findById(_id);

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        const previousCategory = project.category;

        if (name) project.name = name;
        if (key) project.key = key;
        if (description) project.description = description;
        if (lead) project.lead = lead;
        if (members) project.members = members;

        if (comment && user) {
            project.comments.push({
                text: comment,
                user: user,
                createdAt: new Date()
            });
        }
        if (tasks) {
            project.tasks = tasks;
        }

        if (category && category !== previousCategory) {
            project.category = category;

            switch (category) {
                case "To Do":
                    project.todoDate = new Date();
                    break;
                case "In Progress":
                    project.inProgressDate = new Date();
                    break;
                case "Code Review":
                    project.codeReviewDate = new Date();
                    break;
                case "Done":
                    project.doneDate = new Date();
                    break;
                default:
                    break;
            }

            try {
                await sendCategoryUpdateEmail(project, previousCategory, category);
            } catch (emailError) {
                console.error("Error sending category update email:", emailError);
            }
        }

        const previousStatus = project.status;
        if (status && status !== previousStatus) {
            project.status = status;

            if (status === 'completed' && previousStatus !== 'completed') {
                try {
                    await sendCompletionEmail(project);
                } catch (emailError) {
                    console.error("Error sending completion email:", emailError);
                }
            }
        }

        await project.save();

        const updatedProject = await Project.findById(_id).populate("lead members tasks");
        const simplifiedProject = {
            _id: updatedProject._id,
            name: updatedProject.name,
            key: updatedProject.key,
            description: updatedProject.description,
            category: updatedProject.category,
            lead: updatedProject.lead ? {
                _id: updatedProject.lead._id,
                name: updatedProject.lead.name,
                role: updatedProject.lead.role,
            } : null,
            members: updatedProject.members.map(member => ({
                _id: member._id,
                name: member.name,
                role: member.role,
            })),
            comments: updatedProject.comments.map(comment => ({
                text: comment.text,
                user: comment.user,
                createdAt: comment.createdAt
            })),
            tasks: updatedProject.tasks.map(task => ({
                _id: task._id,
                name: task.name,
                description: task.description,
                status: task.status,
            })),
            todoDate: updatedProject.todoDate || null,
            inProgressDate: updatedProject.inProgressDate || null,
            codeReviewDate: updatedProject.codeReviewDate || null,
            pendingDate: updatedProject.pendingDate || null,
            doneDate: updatedProject.doneDate || null,
        };

        res.status(200).json(simplifiedProject);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error in updating project", error: err.message });
    }
};
async function sendCategoryUpdateEmail(project, previousCategory, newCategory) {
    const leadUser = await User.findById(project.lead);
    const memberUsers = await User.find({ _id: { $in: project.members } });

    if (!leadUser) {
        throw new Error("Lead user not found");
    }

    const mailOptions = {
        from: 'jira.tool@gmail.com',
        to: [leadUser.email, ...memberUsers.map(member => member.email)].join(', '),
        subject: `Project Update: ${project.name} is now ${newCategory}`,
        html: `<p>Dear ${leadUser.name} and team,</p>
               <p>The project <strong>"${project.name}"</strong> has moved from <strong>${previousCategory}</strong> to <strong>${newCategory}</strong>.</p>
               <p>Keep up the great work!</p>
               <p>Updated Date: ${new Date().toLocaleDateString()}</p>`
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error("Error sending category update email:", err);
                return reject(err);
            } else {
                console.log('Category Update Email sent: ' + info.response);
                resolve(info);
            }
        });
    });
}


const deleteProject = async (req, res) => {
    try {
        let project = await Project.findByIdAndDelete(req.params._id);
        if (project) {
            res.json({ msg: "Project deleted" });
        } else {
            res.json({ msg: "Project not found" });
        }
    } catch (err) {
        res.json({ msg: "Error in deleting project" });
    }
};

const getCompletedByLead = async (req, res) => {
    const { _id } = req.params;  

    try {
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid lead ID format' });
        }

        const completedProjects = await Project.find({
            lead: _id,
            status: 'completed'
        })
        .populate({
            path: 'lead',
            select: 'name role' 
        });

        if (!completedProjects || completedProjects.length === 0) {
            return res.status(404).json({ message: 'No completed projects found for this lead' }); 
        }

        const simplifiedProjects = completedProjects.map(project => ({
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            category: project.category,
            status: project.status,
            lead: {
                _id: project.lead._id,
                name: project.lead.name,
                role: project.lead.role
            },
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            doneDate: project.doneDate,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));

        res.status(200).json(simplifiedProjects); // Explicit 200 OK

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching completed projects by lead' });
    }
};



const getCompletedByProject = async (req, res) => {
    const { _id } = req.params;  // Use _id to match the route parameter

    try {
        // Validate that _id is a valid ObjectId (optional but recommended)
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        const completedProjects = await Project.find({
            _id: _id,  // Use _id in the query
            status: 'completed'
        }).populate('lead');

        if (!completedProjects || completedProjects.length === 0) {
            return res.status(404).json({ message: 'No completed projects found for this project ID' });
        }

        // Simplify the response (optional but good practice)
        const simplifiedProjects = completedProjects.map(project => ({
            _id: project._id,
            name: project.name,
            key: project.key,
            description: project.description,
            lead: {
                _id: project.lead._id,
                name: project.lead.name,
                role: project.lead.role,
            },
            todoDate: project.todoDate,
            inProgressDate: project.inProgressDate,
            codeReviewDate: project.codeReviewDate,
            doneDate: project.doneDate,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
        }));

        res.status(200).json(simplifiedProjects); // Explicit 200 OK

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching completed projects by project' });
    }
};

const getProjectsByUserId = async (req, res) => {
    const userId = req.params.userId;

    try {
        const projects = await Project.find({
            $or: [
                { members: userId },
                { lead: userId }
            ]
        })
        .populate({
            path: 'lead',
            select: 'name role'
        })
        .populate({
            path: 'members',
            select: 'name role'
        });

        if (!projects || projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this user' });
        }

        res.status(200).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getProjectDetail = async (req, res) => {
    const { _id } = req.params;
    try {
        const project = await Project.findById(_id)
            .populate({
                path: 'lead',
                select: 'name role'
            })
             .populate({  // Populate the 'members' field
                path: 'members',
                select: 'name role' // Adjust the select to include 'role' if needed
            });;

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching project details' });
    }
};


const addTaskToProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, status, assignedTo, startDate, endDate } = req.body;

        const project = await Project.findOne({ _id: projectId });

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        const newTask = {
            name,
            status,
            assignedTo,
            startDate,
            endDate
        };

        project.tasks.push(newTask);
        await project.save();

        const assignedUser = await User.findById(assignedTo);
        if (assignedUser) {
            const taskMailOptions = {
                from: 'jira.tool@gmail.com',
                to: assignedUser.email,
                subject: `New Task Assigned: ${name}`,
                html: `<p>Dear ${assignedUser.name},</p>
                       <p>A new task has been assigned to you in project: <strong>${project.name}</strong></p>
                       <ul>
                           <li><strong>Task Name:</strong> ${name}</li>
                           <li><strong>Status:</strong> ${status}</li>
                           <li><strong>Start Date:</strong> ${startDate}</li>
                           <li><strong>End Date:</strong> ${endDate}</li>
                       </ul>
                       <p>Please check your task board for updates.</p>`
            };

            transporter.sendMail(taskMailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Task Email sent: ' + info.response);
                }
            });
        }

        res.status(201).json({
            msg: "Task added successfully",
            task: newTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error adding task to project", error: err.message });
    }
};


// const addTaskToProject = async (req, res) => {
//     try {
//         const { projectId } = req.params;  // Get project ID from URL parameters
//         const { name, status, assignedTo, startDate, endDate } = req.body; // Get task details from request body

//         // Find the project by its UUID
//         const project = await Project.findOne({ _id: projectId });

//         if (!project) {
//             return res.status(404).json({ msg: "Project not found" });
//         }

//         // Create the new task object
//         const newTask = {
//             name,
//             status,
//             assignedTo,
//             startDate,
//             endDate
//         };

//         // Add the new task to the project's tasks array
//         project.tasks.push(newTask);

//         // Save the updated project
//         await project.save();

//         res.status(201).json({
//             msg: "Task added successfully",
//             task: newTask  // Respond with the newly created task
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: "Error adding task to project", error: err.message });
//     }
// };

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject, getCompletedByLead, getCompletedByProject,getProjectDetail, getProjectsByUserId,addTaskToProject };
