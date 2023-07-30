let wall='rgb(255, 255, 255)';
let original='rgb(229, 155, 170)';

let path='rgb(252, 227, 3)';
let len=20;
let count_of_clicking_solve=0;
let whatcellisclicked;
function setup(){
    //maze container
    let maze=document.getElementById("maze");
    for(let i=0; i<len; i++){
        let row=document.createElement('div');
        row.className='row row'+(i+1);
        row.id='row'+(i+1);
        for(let j=0; j<len; j++){
            let node=document.createElement('div');
            node.className='node node'+((i*len)+(j+1));
            node.id='node'+((i*len)+(j+1));
            if((i+j)!=0 && (i+j)!=(2*len-2)){
                node.style.backgroundColor=original;
                node.onclick=function(){
                    clicked(this.id);
                }
            }
            row.appendChild(node);
        }
        maze.appendChild(row);
    }
}

function clicked(elementID){
    let node=document.getElementById(elementID);
    whatcellisclicked=node;
    if(node.style.backgroundColor==wall){
        node.style.backgroundColor=original;
    }
    else{
        node.style.backgroundColor=wall;
    }
    if(count_of_clicking_solve>0)solvemaze();
}


function reset(){
    for(let i=2; i<(len*len); i++){
        let node=document.getElementById('node'+i);
        node.style.backgroundColor=original;
    }
    document.getElementById('node1').style.backgroundColor='rgb(0, 0, 255)';
    document.getElementById('node'+len*len).style.backgroundColor='rgb(128, 0, 128)';
    count_of_clicking_solve=0;
}


function previouslysolved(){
    for(let i=2; i<400; i++){
        if(document.getElementById('node'+i).style.backgroundColor==path){
            document.getElementById('node'+i).style.backgroundColor=original;
        }
        // console.log(document.getElementById('node'+i).style.backgroundColor);
    }
    document.getElementById('node1').style.backgroundColor='rgb(0, 0, 255)';
    document.getElementById('node'+len*len).style.backgroundColor='rgb(128, 0, 128)';
}



function solvemaze(){
    count_of_clicking_solve++;
    previouslysolved();
    // console.log(x);

    let whole_maze=[];
    
    for(let i=0; i<len; i++){
        whole_maze[i]=new Array(len).fill(0);
    }


    let row_count=0;
    let col_count=0;
    let nodeval=1;


    for(let i=1; i<(len*len+1); i++){
        if(document.getElementById('node'+i).style.backgroundColor==wall){
            whole_maze[row_count][col_count]=-1;
        }
        else{
            whole_maze[row_count][col_count]=nodeval;
        }
        col_count++;
        if(col_count==len){
            row_count++;
            col_count=0;
        }
        nodeval++;
    }

    // console.log(whole_maze);

    let adjList={};

    let possiblemoves=[
        [-1, 0],
        [1, 0], 
        [0, 1], 
        [0, -1]
    ];

    for(let row=0; row<len; row++){
        for(let col=0; col<len; col++){
            if(whole_maze[row][col]==-1){
                continue;
            }
            let curnode=whole_maze[row][col];
            let neighbours=[];
            for(let count=0; count<possiblemoves.length; count++){
                let newrow= possiblemoves[count][0]+row;
                let newcol= possiblemoves[count][1]+col;


                if((newrow>=0 && newrow<whole_maze.length) && (newcol>=0 && newcol<whole_maze.length)){
                    if(whole_maze[newrow][newcol]!=-1){
                        neighbours.push([newrow, newcol]);
                    }
                }
            }
            
            adjList[curnode]=neighbours;
        }
    }

    // console.log(adjList);
    //traversal
    
    let visited=[];
    let prev=new Array(len*len).fill(0);

    for(let i=0; i<len; i++){
        visited[i]=new Array(len).fill(false);
    }

    let queue=[];

    let solved=false;
    queue.push([0, 0]);
    while(queue.length>0){
        let nodecoordinate=queue.splice(0,1)[0];
        let node=whole_maze[nodecoordinate[0]][nodecoordinate[1]];

        visited[nodecoordinate[0]][nodecoordinate[1]]=true;

        if(nodecoordinate[0]==len-1 && nodecoordinate[1]==len-1){
            solved =true;
            break;
        }

        let adj=adjList[node];

        for(let count=0; count<adj.length; count++){
            let n=adj[count];
            if(!visited[n[0]][n[1]]){
                visited[n[0]][n[1]]=true;
                queue.push(n);
                prev[(whole_maze[n[0]][n[1]])-1]=node-1;
            }
        }
    }

    if(!solved){
        let response=confirm("This Maze is impossible! Do you want it to reset?");
        if(response){
            reset();
            // return "";
        }
        else{
            let e=whatcellisclicked;
            // console.log(e);
            e.style.backgroundColor=original;
            solvemaze();
        }
        return "";
    }
    
    //retrace

    let endnode=whole_maze[len-1][len-1];
    document.getElementById('node'+endnode).style.backgroundColor= path;

    let previous=endnode-1;
    let loopcontrol=false;
    while(true){
        let node=prev[previous];
        try{
            document.getElementById('node'+(node+1)).style.backgroundColor=path;
        }catch(err){
            loopcontrol=true;
        }
        if(node==0){
            loopcontrol=true;
        }else{
            previous=node;
        }

        if(loopcontrol){
            break;
        }
    }

    document.getElementById('node1').style.backgroundColor= path;
}